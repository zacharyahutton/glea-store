"""Turn an Admin API read into the Storefront-shaped fixture the site reads when no token is set."""
import json, sys, re

src, out = sys.argv[1], sys.argv[2]
raw = json.load(open(src))
d = raw.get("data", raw)

def img(i):
    if not i: return None
    return {"url": i["url"], "altText": i.get("altText"), "width": i.get("width"), "height": i.get("height")}

def money(a, c="USD"):
    return {"amount": str(a), "currencyCode": c} if a is not None else None

cur = d["shop"]["currencyCode"]
products = []
for p in d["products"]["nodes"]:
    variants = []
    for v in p["variants"]["nodes"]:
        variants.append({
            "id": v["id"].replace("gid://shopify/ProductVariant/", "gid://shopify/ProductVariant/"),
            "title": v["title"], "sku": v.get("sku"),
            "availableForSale": v["availableForSale"],
            "price": money(v["price"], cur), "compareAtPrice": money(v.get("compareAtPrice"), cur),
            "selectedOptions": v["selectedOptions"], "image": img(v.get("image")),
        })
    images = [img(m["preview"]["image"]) for m in p["media"]["nodes"] if m.get("preview") and m["preview"].get("image")]
    prices = [float(v["price"]["amount"]) for v in variants]
    products.append({
        "id": p["id"], "handle": p["handle"], "title": p["title"], "vendor": p["vendor"],
        "productType": p["productType"], "tags": p["tags"], "descriptionHtml": p["descriptionHtml"],
        "updatedAt": p["updatedAt"], "seo": p["seo"],
        "options": [{"name": o["name"], "optionValues": [{"name": ov["name"], "swatch": ov.get("swatch")} for ov in o["optionValues"]]} for o in p["options"]],
        "priceRange": {"minVariantPrice": money(min(prices), cur), "maxVariantPrice": money(max(prices), cur)},
        "images": images, "variants": variants,
    })

policy_handles = {"PRIVACY_POLICY": "privacy-policy", "REFUND_POLICY": "refund-policy", "SHIPPING_POLICY": "shipping-policy",
                  "TERMS_OF_SERVICE": "terms-of-service", "CONTACT_INFORMATION": "contact-information", "LEGAL_NOTICE": "legal-notice",
                  "SUBSCRIPTION_POLICY": "subscription-policy", "TERMS_OF_SALE": "terms-of-sale"}
policies = [{"handle": policy_handles.get(x["type"], x["type"].lower().replace("_", "-")), "title": x["title"], "body": x["body"]}
            for x in d["shop"]["shopPolicies"] if x.get("body")]

fixture = {
    "_source": "Admin API read of the real store. Regenerate with npm run fixture:pull.",
    "shop": {"name": d["shop"]["name"], "email": d["shop"]["email"], "currencyCode": cur, "primaryDomain": d["shop"]["primaryDomain"]},
    "policies": policies,
    "products": products,
    "collections": [{"handle": c["handle"], "title": c["title"], "description": c["description"], "descriptionHtml": c.get("descriptionHtml", ""),
                     "productHandles": [n["handle"] for n in c["products"]["nodes"]]} for c in d["collections"]["nodes"]],
    "pages": [{"handle": x["handle"], "title": x["title"], "body": x["body"], "bodySummary": x["bodySummary"], "updatedAt": x["updatedAt"]}
              for x in d["pages"]["nodes"] if x["isPublished"]],
    "blogs": [{"handle": b["handle"], "title": b["title"],
               "articles": [{"handle": a["handle"], "title": a["title"], "contentHtml": a["body"], "excerpt": a.get("summary"),
                             "publishedAt": a["publishedAt"], "tags": a["tags"], "image": img(a.get("image")),
                             "authorName": (a.get("author") or {}).get("name")} for a in b["articles"]["nodes"] if a["isPublished"]]}
              for b in d["blogs"]["nodes"]],
    "menus": [{"handle": m["handle"], "title": m["title"], "items": m["items"]} for m in d["menus"]["nodes"]],
}
json.dump(fixture, open(out, "w"), indent=1, ensure_ascii=False)
