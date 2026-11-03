import { STOREFRONT_ENDPOINT, STOREFRONT_TOKEN } from "./config";

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

/** Typed Storefront API call. Works in server components, route handlers and the browser (public token). */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: { revalidate?: number; tags?: string[]; cache?: RequestCache } = {},
): Promise<T> {
  const res = await fetch(STOREFRONT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(opts.cache ? { cache: opts.cache } : {}),
    ...(typeof window === "undefined" && !opts.cache
      ? { next: { revalidate: opts.revalidate ?? 300, tags: opts.tags } }
      : {}),
  } as RequestInit);
  if (!res.ok) throw new Error(`Storefront API ${res.status}`);
  const json = (await res.json()) as GqlResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Storefront API returned no data");
  return json.data;
}
