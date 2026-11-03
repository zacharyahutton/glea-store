export type Money = { amount: string; currencyCode: string };
export type Image = { url: string; altText: string | null; width: number | null; height: number | null };
export type SelectedOption = { name: string; value: string };

export type Variant = {
  id: string;
  title: string;
  sku?: string | null;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  image: Image | null;
};

export type ProductOption = {
  name: string;
  optionValues: { name: string; swatch: { color: string | null } | null }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  updatedAt: string;
  seo: { title: string | null; description: string | null };
  options: ProductOption[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  images: Image[];
  variants: Variant[];
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  products: Product[];
};

export type Page = { handle: string; title: string; body: string; bodySummary: string; updatedAt: string };

export type Article = {
  handle: string;
  title: string;
  contentHtml: string;
  excerpt: string | null;
  publishedAt: string;
  tags: string[];
  image: Image | null;
  authorName: string | null;
};

export type Blog = { handle: string; title: string; articles: Article[] };

export type MenuItem = { title: string; url: string; items?: MenuItem[] };
export type Menu = { handle: string; title: string; items: MenuItem[] };

export type Policy = { handle: string; title: string; body: string };

export type Shop = {
  name: string;
  email: string;
  currencyCode: string;
  primaryDomain: { url: string; host: string };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    image: Image | null;
    price: Money;
    product: { handle: string; title: string };
  };
  cost: { totalAmount: Money };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: { subtotalAmount: Money; totalAmount: Money };
  discountAllocations?: { discountedAmount: Money }[];
};
