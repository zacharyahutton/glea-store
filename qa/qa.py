"""Glea storefront QA: overflow, console errors, JSON-LD, analytics events.
Run: python3 qa/qa.py [base_url]   (server must be running, e.g. PORT=3100 npm start)"""
import json, sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3100"
PATHS = ["/", "/products/glea-clip-on-book-reading-light", "/collections/all", "/cart", "/pages/about",
         "/pages/contact", "/pages/faq", "/pages/track-order", "/pages/returns", "/pages/data-sharing-opt-out",
         "/blogs/news", "/search?q=pink", "/policies/refund-policy", "/policies/privacy-policy", "/nope-404"]
WIDTHS = [1280, 390, 360]
fail = 0
report = {"pages": [], "events": None}

with sync_playwright() as p:
    b = p.chromium.launch()
    for w in WIDTHS:
        ctx = b.new_context(viewport={"width": w, "height": 900})
        ctx.add_init_script("localStorage.setItem('glea_consent_v1', JSON.stringify({analytics:false,marketing:false,at:Date.now()}));localStorage.setItem('glea_popup_v1', String(Date.now()))")
        for path in PATHS:
            pg = ctx.new_page()
            errs = []
            pg.on("console", lambda m, e=errs: e.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda x, e=errs: e.append(str(x)))
            r = pg.goto(BASE + path, wait_until="networkidle")
            over = pg.evaluate("""() => { const W = document.documentElement.clientWidth; const bad = [];
              document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect();
                if (r.width && (r.right > W + 1) && getComputedStyle(el).position !== 'fixed' && !el.closest('[aria-hidden=true],.hero__track,.gal__track,.marquee,[inert]')) bad.push(el.tagName + '.' + el.className.toString().slice(0,40)); });
              return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0,5) }; }""")
            ld = pg.evaluate("""() => [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return [].concat(j).map(x => x['@type']).join(','); } catch (e) { return 'PARSE_ERROR'; } })""")
            errs = [e for e in errs if "404" not in e or path != "/nope-404"]
            ok = over["sw"] <= over["W"] and not errs and "PARSE_ERROR" not in ld
            fail += not ok
            report["pages"].append({"w": w, "path": path, "status": r.status, "overflow": over["sw"] - over["W"], "bad": over["bad"], "console": errs[:3], "jsonld": ld, "ok": ok})
            pg.close()
        ctx.close()

    # Analytics events flow (desktop)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    ctx.add_init_script("localStorage.setItem('glea_popup_v1', String(Date.now()))")
    pg = ctx.new_page()
    logged = []
    pg.on("console", lambda m: logged.append(m.text) if m.text.startswith("[glea analytics]") else None)
    pg.goto(BASE + "/products/glea-clip-on-book-reading-light?color=pink&utm_source=qa&utm_medium=test&debug_analytics=1", wait_until="networkidle")
    banner = pg.get_by_role("button", name="Necessary only")
    if banner.count(): banner.first.click()
    pg.wait_for_timeout(500)
    pg.locator(".pdp__info .btn--primary.btn--block").first.click()
    pg.wait_for_timeout(5000)
    utm = pg.evaluate("() => localStorage.getItem('glea_utm_v1')")
    seen = []
    pg.route("**/*", lambda route: (seen.append(route.request.url), route.abort()) if route.request.is_navigation_request() and not route.request.url.startswith(BASE) else route.continue_())
    co = pg.get_by_role("button", name="Checkout")
    if co.count():
        co.first.click()
        pg.wait_for_timeout(4000)
    ev = [t.split()[2] for t in logged]
    report["events"] = {"utm_stored": utm, "checkout_target": [u.split("?")[0] for u in seen][:1], "events": ev}
    b.close()

json.dump(report, open("qa/qa-report.json", "w"), indent=1)
for r in report["pages"]:
    if not r["ok"]: print("FAIL", r)
print(f"{len(report['pages']) - fail}/{len(report['pages'])} page checks passed")
print("events:", report["events"])
