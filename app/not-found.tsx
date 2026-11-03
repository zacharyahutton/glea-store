import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container sec">
      <div className="empty">
        <span className="kicker">404</span>
        <h1 className="h1">This page went dark.</h1>
        <p className="muted">The page you were looking for is not here. Try one of these instead.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link className="btn btn--primary" href="/products/glea-clip-on-book-reading-light">Shop the light</Link>
          <Link className="btn btn--ghost" href="/pages/faq">Read the FAQ</Link>
        </div>
      </div>
    </div>
  );
}
