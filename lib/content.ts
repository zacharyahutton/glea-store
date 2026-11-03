/**
 * Site copy reused from the approved theme v2. Facts only. Anything unconfirmed is marked TODO and
 * filtered out by `known()` so it never shows on the storefront.
 */
export type QA = { q: string; a: string; topic: "light" | "order" | "returns" | "help" };

export const isTodo = (s: string) => /TODO\(/.test(s);
export const known = <T extends { a?: string; q?: string; value?: string; text?: string; title?: string }>(items: T[]) =>
  items.filter((i) => !Object.values(i).some((v) => typeof v === "string" && isTodo(v)));

export const faqs: QA[] = [
  { topic: "light", q: "What colors are there?", a: "Six: Black, Amber, Pink, Purple, Lake Blue and White." },
  { topic: "light", q: "What is in the box?", a: "A reading light in your color, a charging cable and a silicone page-follower bookmark." },
  { topic: "light", q: "How long does the battery last?", a: "TODO(zach): battery hours from the supplier." },
  { topic: "light", q: "How do I charge it?", a: "TODO(zach): cable type and charge time." },
  { topic: "light", q: "How bright is it?", a: "The brightness is adjustable, so you can keep it soft." },
  { topic: "light", q: "Will it bother my partner?", a: "The light points at your page, so most of the room stays dark. Some light may still be visible, especially at high brightness. Turning it down helps." },
  { topic: "light", q: "Does it fit hardcovers and paperbacks?", a: "It clips to both. It holds best on the back cover or on a hardcover." },
  { topic: "order", q: "How long does US shipping take?", a: "TODO(zach): US delivery time in business days." },
  { topic: "order", q: "Do you offer free shipping?", a: "Yes. US orders of $45 or more ship free. Orders under $45 ship for a flat $4.99." },
  { topic: "order", q: "Do you ship outside the US?", a: "We ship within the United States." },
  { topic: "order", q: "Where is my order?", a: "Open your order confirmation email and use the link to your order status page. It shows tracking once your order ships. You can also write to hello@getglea.com with your order number." },
  { topic: "order", q: "Is there a deal for buying two?", a: "Yes. Buy 2 lights and $5 comes off at checkout." },
  { topic: "returns", q: "What is your return policy?", a: "We accept returns within 14 days. Email hello@getglea.com with your order number to start one. Details are confirmed by email." },
  { topic: "returns", q: "How do I start a return?", a: "Write to hello@getglea.com with your order number and we will reply with the next steps." },
  { topic: "help", q: "How do I contact you?", a: "Write to hello@getglea.com and a real person will reply." },
];

export const topics: { id: QA["topic"]; label: string }[] = [
  { id: "light", label: "The light" },
  { id: "order", label: "Orders and shipping" },
  { id: "returns", label: "Returns" },
  { id: "help", label: "Help" },
];

export const features = [
  { icon: "clip", title: "Clip-on", text: "Clips to your book." },
  { icon: "neck", title: "Bendable neck", text: "Aim the glow at your page." },
  { icon: "battery", title: "Rechargeable", text: "No batteries to buy." },
  { icon: "sun", title: "Adjustable brightness", text: "Set it as soft as you like." },
  { icon: "palette", title: "6 colors", text: "Black, Amber, Pink, Purple, Lake Blue, White." },
];

export const benefits = [
  { title: "Your page, not the room", text: "The glow lands on your page, so the room can stay dark for whoever is sleeping." },
  { title: "Clips on, bends where you need", text: "Clip it to your book and bend the neck to aim the light." },
  { title: "Bookmark in every box", text: "Every order comes with a silicone page-follower bookmark." },
];

export const aplus = [
  { slot: "APLUS-01", heading: "Soft light, after dark.", sub: "Clip it on, switch it on, keep reading.", chips: ["Clip-on", "Bendable neck", "Rechargeable", "6 colors"] },
  { slot: "APLUS-02", heading: "Your page glows. The room stays dark.", sub: "The light points down at your page, not across the room." },
  { slot: "APLUS-03", heading: "Bend it where you need it.", sub: "Twist the neck to aim the glow right where you are reading." },
  { slot: "APLUS-04", heading: "Pick your glow.", sub: "Adjustable brightness, so you can keep it as soft as you like." },
  { slot: "APLUS-05", heading: "Charge it, then read.", sub: "Rechargeable, so there are no batteries to buy." },
  { slot: "APLUS-06", heading: "Six colors for six kinds of readers.", sub: "Black, Amber, Pink, Purple, Lake Blue and White." },
  { slot: "APLUS-07", heading: "In the box", sub: "Your Glea light, a charging cable and a silicone page-follower bookmark." },
];

export const compare = {
  heading: "Glea vs the usual ways to read at night",
  cols: ["Glea", "Bedside lamp", "Phone flashlight"],
  rows: [
    { label: "Lights your page, not the room", v: [true, false, false] },
    { label: "Hands free", v: [true, true, false] },
    { label: "Rechargeable", v: [true, false, true] },
    { label: "Clips to your book", v: [true, false, false] },
    { label: "Fits in a bag", v: [true, false, true] },
  ],
};

export const details = [
  { label: "Colors", value: "Black, Amber, Pink, Purple, Lake Blue, White" },
  { label: "Power", value: "Rechargeable" },
  { label: "Brightness", value: "Adjustable" },
  { label: "In the box", value: "Reading light, charging cable, silicone page-follower bookmark" },
  { label: "Battery life", value: "TODO(zach) hours" },
  { label: "Charge time", value: "TODO(zach)" },
  { label: "Charging cable", value: "TODO(zach) cable type" },
  { label: "Brightness output", value: "TODO(zach) lumens" },
  { label: "Delivery time", value: "TODO(zach) business days" },
];

export const heroSlides = [
  { slot: "HERO-03", heading: "Find your reading light.", sub: "Six colors. Clips to any book. A warm glow that stays on your page.", cta: "Shop the light", tone: "dark" as const },
  { slot: "HERO-02", heading: "One more chapter. Glea's got the light.", sub: "Six colors. Rechargeable. Made for reading in bed.", cta: "Shop the light", tone: "light" as const },
  { slot: "HERO-01", heading: "Soft light, after dark.", sub: "Clip it on, switch it on, keep reading.", cta: "Pick your color", tone: "light" as const },
];

export const moments = [
  { slot: "TILE-01", label: "Reading in bed" },
  { slot: "TILE-02", label: "Travel" },
  { slot: "TILE-03", label: "For a reader you love" },
];

export const aiNote =
  "Some lifestyle photos on this site are AI-generated to show how Glea is used. Product and color photos show the real light.";
