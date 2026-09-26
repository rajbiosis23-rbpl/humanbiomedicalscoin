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

// Re-exports from client-safe catalog utils
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

export function findProductBySlug(allProducts = [], slug = "") {
  if (!slug || !allProducts || !allProducts.length) return null;
  const target = normalizeSlug(slug);
  return (
    allProducts.find((p) => {
      if (!p) return false;
      if (normalizeSlug(p.slug) === target) return true;
      if (normalizeSlug(p.title) === target) return true;
      if (p.slug === slug || p.id === slug || p.uid === slug) return true;
      return false;
    }) || null
  );
}

/**
 * Pure Client-safe helper to fetch live catalog from /api/catalog
 */
export async function fetchFullCatalog() {
  try {
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.products || json.categoryProducts || [];
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchFullCatalog error:", e);
  }
  return [];
}

/**
 * Pure Client-safe helper to fetch full catalog data with categoryList
 */
export async function fetchFullCatalogData() {
  try {
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return {
        categoryProducts: json.products || json.categoryProducts || [],
        categoryList: json.categoryList || [],
        count: json.count || 0,
      };
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchFullCatalogData error:", e);
  }
  return { categoryProducts: [], categoryList: [], count: 0 };
}

/**
 * Pure Client-safe helper for categories data
 */
export async function getCategoriesData() {
  return await fetchFullCatalogData();
}

/**
 * Pure Client-safe helper to fetch single product by slug
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;
  const products = await fetchFullCatalog();
  return findProductBySlug(products, slug);
}

/**
 * Pure Client-safe helper to fetch home page data
 */
export async function fetchHomeData() {
  try {
    const res = await fetch("/api/site-data?type=home", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchHomeData error:", e);
  }
  return null;
}

/**
 * Pure Client-safe helper to fetch contact page info
 */
export async function fetchContactData() {
  try {
    const res = await fetch("/api/site-data?type=contact", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.contactInfo || json.data?.contactInfo || json.data || [];
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchContactData error:", e);
  }
  return [];
}

/**
 * Pure Client-safe helper to fetch services page data
 */
export async function fetchServicesData() {
  try {
    const res = await fetch("/api/site-data?type=services", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.services || json.data?.services || json.data || [];
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchServicesData error:", e);
  }
  return [];
}

/**
 * Pure Client-safe helper to fetch district data
 */
export async function fetchDistrictData(district) {
  if (!district) return null;
  try {
    const res = await fetch(`/api/site-data?type=districts&district=${encodeURIComponent(district)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchDistrictData error:", e);
  }
  return null;
}

/**
 * Pure Client-safe helper to fetch all districts
 */
export async function fetchDistrictsList() {
  try {
    const res = await fetch("/api/site-data?type=districts", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.districts || json.data || [];
    }
  } catch (e) {
    console.warn("[data-fetcher] fetchDistrictsList error:", e);
  }
  return [];
}
