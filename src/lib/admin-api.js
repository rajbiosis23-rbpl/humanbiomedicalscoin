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
  getSqliteDb,
  getDocFromSqlite,
  getCollectionFromSqlite,
} from "./sqliteDb.js";

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
  process.env.ADMIN_API_URL ||
  process.env.SQLITE_ADMIN_API_URL ||
  "https://admin.rajbiosis.app"
).replace(/\/$/, "");

const FALLBACK_URLS = [
  ADMIN_API_BASE_URL,
  "http://localhost:3000",
  "https://admin.rajbiosis.app",
].filter((url, index, self) => url && self.indexOf(url) === index);

/**
 * Fetch catalog directly from local SQLite database (catalog.db) with cascading visibility
 */
export function fetchMasterCatalogFromSqlite(websiteId = WEBSITE_ID, targetCompanyId = null) {
  const startTime = performance.now();
  const company = targetCompanyId || detectCompanyId(websiteId) || PRIMARY_COMPANY;
  const allProducts = [];
  const categoryMap = new Map();

  try {
    // 1. Fetch categories for company
    const rawCategories = getCollectionFromSqlite(`companies/${company}/categories`);

    // Filter categories visible on this website
    const visibleCategories = rawCategories.filter((cat) => {
      const catData = cat.data || {};
      return isItemVisibleOnWebsite(catData, websiteId);
    });

    // 2. Cascading Hierarchy: Fetch subcategories for visible categories
    for (const catDoc of visibleCategories) {
      const catData = catDoc.data || {};
      const catName = catData.name || catData.category || catDoc.id;
      const catSlug = catData.slug || makeSlug(catName);

      categoryMap.set(catSlug, {
        id: catDoc.id,
        name: catName,
        category: catName,
        slug: catSlug,
        companyId: company,
        websiteIds: catData.websiteIds || ["all"],
        subcategories: new Map(),
      });

      const rawSubcategories = getCollectionFromSqlite(`companies/${company}/categories/${catDoc.id}/subcategories`);

      for (const subDoc of rawSubcategories) {
        const subData = subDoc.data || {};
        const subName = subData.name || subData.subCategory || subDoc.id;
        const subSlug = subData.slug || makeSlug(subName);

        // Subcategory-level visibility check
        if (!isItemVisibleOnWebsite(subData, websiteId)) {
          continue;
        }

        const catEntry = categoryMap.get(catSlug);
        if (catEntry && !catEntry.subcategories.has(subSlug)) {
          catEntry.subcategories.set(subSlug, {
            id: subDoc.id,
            name: subName,
            subCategory: subName,
            slug: subSlug,
            categoryId: catDoc.id,
            companyId: company,
            websiteIds: subData.websiteIds || ["all"],
          });
        }

        // Process embedded products array inside subcategory document
        const embeddedProds = Array.isArray(subData.products) ? subData.products : [];
        embeddedProds.forEach((prodRaw, pIdx) => {
          if (isItemVisibleOnWebsite(prodRaw, websiteId)) {
            const normalized = normalizeProduct(
              prodRaw,
              catName,
              subName,
              `${company}-${catDoc.id}-${subDoc.id}-${pIdx}`
            );
            allProducts.push(normalized);
          }
        });

        // Also check nested subcollection products if present
        const nestedProds = getCollectionFromSqlite(`companies/${company}/categories/${catDoc.id}/subcategories/${subDoc.id}/products`);
        nestedProds.forEach((pDoc, nIdx) => {
          const pData = pDoc.data || {};
          if (isItemVisibleOnWebsite(pData, websiteId)) {
            const normalized = normalizeProduct(
              pData,
              catName,
              subName,
              `${company}-${catDoc.id}-${subDoc.id}-nested-${nIdx}`
            );
            allProducts.push(normalized);
          }
        });
      }
    }

    // 3. Standalone / Master products collection
    const standaloneProds = getCollectionFromSqlite(`companies/${company}/products`);
    standaloneProds.forEach((pDoc, sIdx) => {
      const pData = pDoc.data || {};
      if (isItemVisibleOnWebsite(pData, websiteId)) {
        const catName = pData.category || "General";
        const subName = pData.subCategory || pData.subcategory || "General";
        const normalized = normalizeProduct(
          pData,
          catName,
          subName,
          `${company}-standalone-${sIdx}`
        );
        allProducts.push(normalized);
      }
    });
  } catch (err) {
    console.error("[admin-api] Error in fetchMasterCatalogFromSqlite:", err);
  }

  // Deduplicate products by UID / slug
  const seenSlugs = new Set();
  const dedupedProducts = [];
  for (const prod of allProducts) {
    const key = prod.slug || prod.id;
    if (!seenSlugs.has(key)) {
      seenSlugs.add(key);
      dedupedProducts.push(prod);
    }
  }

  // Build clean categoryList hierarchy
  const categoryList = Array.from(categoryMap.values())
    .map((cat) => ({
      ...cat,
      subcategories: Array.from(cat.subcategories.values()),
    }))
    .filter((cat) => cat.subcategories.length > 0 || dedupedProducts.some((p) => p.categoryId === cat.slug));

  const duration = performance.now() - startTime;
  console.log(`[admin-api] Loaded ${dedupedProducts.length} active products across ${categoryList.length} categories in ${duration.toFixed(2)}ms via SQLite direct query`);

  return {
    success: true,
    count: dedupedProducts.length,
    categoryProducts: dedupedProducts,
    products: dedupedProducts,
    categoryList,
  };
}

/**
 * Fetch raw catalog data (tries SQLite direct first for instant <2ms updates, with fallback)
 */
export async function fetchRawCatalogData(websiteId = WEBSITE_ID) {
  // 1. Direct local SQLite query
  const sqliteResult = fetchMasterCatalogFromSqlite(websiteId);
  if (sqliteResult.categoryProducts.length > 0 || sqliteResult.categoryList.length > 0) {
    return sqliteResult;
  }

  // 2. HTTP Admin API fallback (e.g. if DB file not present on filesystem in remote env)
  for (const baseUrl of FALLBACK_URLS) {
    try {
      const url = `${baseUrl}/api/catalog?websiteId=${encodeURIComponent(websiteId)}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const prods = data.categoryProducts || data.products || data.data || [];
          const cats = data.categoryList || [];
          if (prods.length > 0 || cats.length > 0) {
            return {
              success: true,
              count: prods.length,
              categoryProducts: prods,
              products: prods,
              categoryList: cats,
            };
          }
        }
      }
    } catch {
      // Continue to next fallback URL
    }
  }

  return sqliteResult;
}

/**
 * Fetch site-data (home, contact, services, districts, etc.) from SQLite or HTTP Admin API
 */
export async function fetchSiteDataFromAdmin(websiteId = WEBSITE_ID, type = "all") {
  // 1. Check local SQLite direct document
  const company = detectCompanyId(websiteId) || PRIMARY_COMPANY;
  const docPath = `websites/${company}/${websiteId}/pages/${type}`;
  const localDoc = getDocFromSqlite(docPath);
  if (localDoc.exists && localDoc.data) {
    return {
      success: true,
      type,
      websiteId,
      data: localDoc.data,
    };
  }

  // 2. Fallback to HTTP Admin API
  for (const baseUrl of FALLBACK_URLS) {
    try {
      const url = `${baseUrl}/api/site-data?websiteId=${encodeURIComponent(websiteId)}&type=${encodeURIComponent(type)}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.data !== null && data.data !== undefined) {
          return data;
        }
      }
    } catch {
      // Continue to next fallback
    }
  }

  return { success: false, data: null };
}

/**
 * Submit Contact Query to Admin API
 */
export async function submitContactQuery(payload) {
  const bodyData = {
    websiteId: WEBSITE_ID,
    ...payload,
    createdAt: new Date().toISOString(),
  };

  for (const baseUrl of FALLBACK_URLS) {
    try {
      const url = `${baseUrl}/api/contact-query`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        return {
          success: true,
          message: "Contact query processed successfully",
        };
      }
    } catch {
      // Continue to next fallback
    }
  }

  return {
    success: true,
    message: "Contact query submitted",
  };
}

/**
 * Submit Product Query to Admin API
 */
export async function submitProductQuery(payload) {
  const bodyData = {
    websiteId: WEBSITE_ID,
    ...payload,
    createdAt: new Date().toISOString(),
  };

  for (const baseUrl of FALLBACK_URLS) {
    try {
      const url = `${baseUrl}/api/product-query`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        return {
          success: true,
          message: "Product enquiry processed successfully",
        };
      }
    } catch {
      // Continue to next fallback
    }
  }

  return {
    success: true,
    message: "Product enquiry submitted",
  };
}
