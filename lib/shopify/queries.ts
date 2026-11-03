const IMAGE = `url altText width height`;
const MONEY = `amount currencyCode`;

export const PRODUCT_FRAGMENT = `
fragment ProductFields on Product {
  id handle title vendor productType tags descriptionHtml updatedAt
  seo { title description }
  options { name optionValues { name swatch { color } } }
  priceRange { minVariantPrice { ${MONEY} } maxVariantPrice { ${MONEY} } }
  images(first: 30) { nodes { ${IMAGE} } }
  variants(first: 50) { nodes {
    id title sku availableForSale
    price { ${MONEY} } compareAtPrice { ${MONEY} }
    selectedOptions { name value }
    image { ${IMAGE} }
  } }
}`;

export const PRODUCT_QUERY = `${PRODUCT_FRAGMENT}
query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }`;

export const PRODUCTS_QUERY = `${PRODUCT_FRAGMENT}
query Products($first: Int!, $query: String) { products(first: $first, query: $query) { nodes { ...ProductFields } } }`;

export const COLLECTION_QUERY = `${PRODUCT_FRAGMENT}
query Collection($handle: String!) { collection(handle: $handle) {
  handle title description descriptionHtml
  products(first: 50) { nodes { ...ProductFields } }
} }`;

export const COLLECTIONS_QUERY = `query Collections { collections(first: 20) { nodes { handle title description descriptionHtml } } }`;

export const PAGE_QUERY = `query Page($handle: String!) { page(handle: $handle) { handle title body bodySummary updatedAt } }`;
export const PAGES_QUERY = `query Pages { pages(first: 50) { nodes { handle title body bodySummary updatedAt } } }`;

const ARTICLE = `handle title contentHtml excerpt publishedAt tags image { ${IMAGE} } authorV2 { name }`;
export const BLOG_QUERY = `query Blog($handle: String!) { blog(handle: $handle) { handle title articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) { nodes { ${ARTICLE} } } } }`;
export const ARTICLE_QUERY = `query Article($blog: String!, $handle: String!) { blog(handle: $blog) { articleByHandle(handle: $handle) { ${ARTICLE} } } }`;

export const MENU_QUERY = `query Menu($handle: String!) { menu(handle: $handle) { handle title items { title url items { title url } } } }`;

const POLICY = `handle title body`;
export const POLICIES_QUERY = `query Policies { shop {
  name primaryDomain { url host }
  privacyPolicy { ${POLICY} } refundPolicy { ${POLICY} } shippingPolicy { ${POLICY} } termsOfService { ${POLICY} }
} }`;

export const CART_FRAGMENT = `
fragment CartFields on Cart {
  id checkoutUrl totalQuantity
  cost { subtotalAmount { ${MONEY} } totalAmount { ${MONEY} } }
  discountAllocations { discountedAmount { ${MONEY} } }
  lines(first: 50) { nodes {
    id quantity
    cost { totalAmount { ${MONEY} } }
    merchandise { ... on ProductVariant {
      id title selectedOptions { name value } image { ${IMAGE} } price { ${MONEY} }
      product { handle title }
    } }
  } }
}`;

export const CART_QUERY = `${CART_FRAGMENT} query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`;
export const CART_CREATE = `${CART_FRAGMENT}
mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ...CartFields } userErrors { field message } } }`;
export const CART_LINES_ADD = `${CART_FRAGMENT}
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } }`;
export const CART_LINES_UPDATE = `${CART_FRAGMENT}
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } }`;
export const CART_LINES_REMOVE = `${CART_FRAGMENT}
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } } }`;
export const CART_ATTRIBUTES_UPDATE = `${CART_FRAGMENT}
mutation CartAttributes($cartId: ID!, $attributes: [AttributeInput!]!) { cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ...CartFields } userErrors { field message } } }`;

export const CUSTOMER_CREATE = `
mutation CustomerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) { customer { id } customerUserErrors { code field message } }
}`;
