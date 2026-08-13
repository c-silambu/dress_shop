import api from "./api";

export const PRODUCT_PAGE_SIZE = 20;
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();
const inFlight = new Map();

const keyFor = (category) => `${category.toLowerCase()}:1:${PRODUCT_PAGE_SIZE}`;

export const getCachedFirstPage = (category) => cache.get(keyFor(category));

export const isProductCacheFresh = (entry) =>
  Boolean(entry && Date.now() - entry.fetchedAt < CACHE_TTL);

export async function fetchFirstProductPage(category) {
  const key = keyFor(category);
  if (inFlight.has(key)) return inFlight.get(key);

  const request = api
    .get("/products", { params: { category, page: 1, limit: PRODUCT_PAGE_SIZE, status: "Active" } })
    .then((response) => {
      const entry = {
        products: response.data,
        total: Number(response.headers["x-total-count"] ?? response.data.length),
        fetchedAt: Date.now(),
      };
      cache.set(key, entry);
      return entry;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, request);
  return request;
}

export function prefetchFirstProductPage(category) {
  const cached = getCachedFirstPage(category);
  if (isProductCacheFresh(cached)) return Promise.resolve(cached);

  return fetchFirstProductPage(category).catch((error) => {
    console.error(`[product-prefetch] Failed to prefetch ${category}`, error);
    return null;
  });
}
