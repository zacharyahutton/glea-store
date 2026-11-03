import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = { title: "Your cart", alternates: { canonical: "/cart" }, robots: { index: false, follow: true } };

export default function CartPage() {
  return (
    <div className="container sec sec--tight">
      <h1 className="h1" style={{ marginBottom: 28 }}>Your cart</h1>
      <CartPageView />
    </div>
  );
}
