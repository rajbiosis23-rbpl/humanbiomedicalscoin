import {
  WEBSITE_ID,
  PRIMARY_COMPANY,
  ALL_COMPANIES,
  normalizeDomainId,
  detectCompanyId,
  makeSlug,
  normalizeSlug,
  isItemVisibleOnWebsite,
  isVisibleOnWebsite,
  normalizeProduct,
} from "./catalog-utils.js";
import {
  saveQueryToMongo,
  getSiteDataFromMongo,
  getCatalogFromMongo,
} from "./mongodb.js";

// Re-export client-safe catalog utils
export {
  WEBSITE_ID,
  PRIMARY_COMPANY,
  ALL_COMPANIES,
  normalizeDomainId,
  detectCompanyId,
  makeSlug,
  normalizeSlug,
  isItemVisibleOnWebsite,
  isVisibleOnWebsite,
  normalizeProduct,
};

export const ADMIN_API_BASE_URL = (
  process.env.ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  process.env.ADMIN_API_URL ||
  "https://admin.rajbiosis.app"
).replace(/\/$/, "");

/**
 * High-speed In-Memory Cache with Stale-While-Revalidate for instant < 1ms SSR response
 */
const MEMORY_CACHE = {
  catalog: { data: null, timestamp: 0, fetching: false },
  siteData: new Map(), // key -> { data, timestamp }
};

const CACHE_TTL_MS = 60 * 1000; // 1 minute fresh cache, then revalidates in background

/**
 * Fetch catalog data from SuperAdmin API with in-memory caching and MongoDB Atlas fallback
 */
export async function fetchRawCatalogData(websiteId = WEBSITE_ID) {
  const now = Date.now();
  const cached = MEMORY_CACHE.catalog;

  // 1. If fresh cache exists, return immediately (< 1ms)
  if (cached.data && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // 2. If stale cache exists, return stale immediately while updating in background
  if (cached.data && !cached.fetching) {
    refreshCatalogInBackground(websiteId);
    return cached.data;
  }

  // 3. Cold start: fetch directly
  return await refreshCatalogInBackground(websiteId, true);
}

async function refreshCatalogInBackground(websiteId = WEBSITE_ID, isColdStart = false) {
  if (MEMORY_CACHE.catalog.fetching && !isColdStart) return;
  MEMORY_CACHE.catalog.fetching = true;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `${ADMIN_API_BASE_URL}/api/catalog?websiteId=${encodeURIComponent(websiteId)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const rawProds = data.categoryProducts || data.products || data.data || [];
        const rawCats = data.categoryList || [];

        const normalizedProds = rawProds.map((p) =>
          normalizeProduct(p, p.category, p.subCategory, "admin")
        );

        const result = {
          success: true,
          count: normalizedProds.length,
          categoryProducts: normalizedProds,
          products: normalizedProds,
          categoryList: rawCats,
        };

        MEMORY_CACHE.catalog = {
          data: result,
          timestamp: Date.now(),
          fetching: false,
        };
        return result;
      }
    }
  } catch (err) {
    console.warn("[admin-api] SuperAdmin catalog fetch error:", err.message);
  } finally {
    MEMORY_CACHE.catalog.fetching = false;
  }

  // Fallback to MongoDB if SuperAdmin fails or during cold start
  if (!MEMORY_CACHE.catalog.data) {
    console.log("[admin-api] Falling back to MongoDB human_products catalog");
    const mongoData = await getCatalogFromMongo(websiteId);
    if (mongoData.count > 0) {
      MEMORY_CACHE.catalog = {
        data: mongoData,
        timestamp: Date.now(),
        fetching: false,
      };
      return mongoData;
    }
  }

  return (
    MEMORY_CACHE.catalog.data || {
      success: false,
      count: 0,
      categoryProducts: [],
      products: [],
      categoryList: [],
    }
  );
}

/**
 * Fetch site-data (home, contact, services, districts) from SuperAdmin API with MongoDB fallback
 */
export async function fetchSiteDataFromAdmin(websiteId = WEBSITE_ID, type = "all") {
  const cacheKey = `${websiteId}_${type}`;
  const now = Date.now();
  const cached = MEMORY_CACHE.siteData.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const url = `${ADMIN_API_BASE_URL}/api/site-data?websiteId=${encodeURIComponent(websiteId)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.data !== null && data.data !== undefined) {
        MEMORY_CACHE.siteData.set(cacheKey, { data, timestamp: now });
        return data;
      }
    }
  } catch (err) {
    console.warn(`[admin-api] Error fetching site-data ${type}:`, err.message);
  }

  // Fallback to MongoDB direct collection
  const mongoRes = await getSiteDataFromMongo(websiteId, type);
  if (mongoRes.success && mongoRes.data) {
    const fallbackData = {
      success: true,
      type,
      websiteId,
      data: mongoRes.data,
    };
    MEMORY_CACHE.siteData.set(cacheKey, { data: fallbackData, timestamp: now });
    return fallbackData;
  }

  return cached ? cached.data : { success: false, data: null };
}

/**
 * Submit Contact Query: Saves in MongoDB AND sends to SuperAdmin API
 */
export async function submitContactQuery(payload) {
  const bodyData = {
    websiteId: WEBSITE_ID,
    ...payload,
    type: "contact",
    createdAt: new Date().toISOString(),
  };

  // 1. Save directly to MongoDB queries collection (guaranteed persistence)
  const mongoPromise = saveQueryToMongo(bodyData);

  // 2. Submit to SuperAdmin API
  let adminSuccess = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${ADMIN_API_BASE_URL}/api/contact-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyData),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      adminSuccess = true;
    }
  } catch (err) {
    console.warn("[admin-api] SuperAdmin contact-query POST error:", err.message);
  }

  const mongoResult = await mongoPromise;

  return {
    success: mongoResult.success || adminSuccess,
    queryId: mongoResult.queryId,
    message: "Thank you! Your contact query has been submitted successfully.",
  };
}

/**
 * Submit Product Query: Saves in MongoDB AND sends to SuperAdmin API
 */
export async function submitProductQuery(payload) {
  const bodyData = {
    websiteId: WEBSITE_ID,
    ...payload,
    type: "product",
    createdAt: new Date().toISOString(),
  };

  // 1. Save directly to MongoDB queries collection (guaranteed persistence)
  const mongoPromise = saveQueryToMongo(bodyData);

  // 2. Submit to SuperAdmin API
  let adminSuccess = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${ADMIN_API_BASE_URL}/api/product-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyData),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      adminSuccess = true;
    }
  } catch (err) {
    console.warn("[admin-api] SuperAdmin product-query POST error:", err.message);
  }

  const mongoResult = await mongoPromise;

  return {
    success: mongoResult.success || adminSuccess,
    queryId: mongoResult.queryId,
    message: "Thank you! Your product enquiry has been received successfully.",
  };
}
