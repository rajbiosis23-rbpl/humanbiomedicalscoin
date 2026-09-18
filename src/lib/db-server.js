import { db, doc, getDoc, getDocs, collection } from "./firebase.js";
import { cache } from "react";

export const WEBSITE_ID = "humanbiomedicalscoin";
export const PRIMARY_COMPANY = "human";
export const ALL_COMPANIES = ["human", "global", "rajbiosis"];

export const makeSlug = (text = "") =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

function safeDecode(str = "") {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export const normalizeSlug = (s = "") =>
  safeDecode(String(s || ""))
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Normalize website IDs by removing dots, hyphens, spaces for bulletproof matching
 */
export function normalizeSiteId(id = "") {
  return String(id || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

const TARGET_SITE_NORM = normalizeSiteId(WEBSITE_ID);

/**
 * Checks if an item (category, subcategory, or product) is visible on this website.
 */
export function isVisibleOnWebsite(item, websiteId = WEBSITE_ID) {
  if (!item) return false;
  if (item.isPublished === false) return false;

  const targetNorm = normalizeSiteId(websiteId) || TARGET_SITE_NORM;

  // If websiteIds is missing (legacy doc without restrictions), default to visible
  if (item.websiteIds === undefined || item.websiteIds === null) {
    return true;
  }

  if (Array.isArray(item.websiteIds)) {
    // If explicitly empty array [] -> 0 websites selected -> HIDDEN FROM ALL
    if (item.websiteIds.length === 0) {
      return false;
    }
    // If includes "all" -> visible on all websites
    if (item.websiteIds.includes("all")) {
      return true;
    }
    // Check if target website is in websiteIds
    return item.websiteIds.some((site) => {
      const siteNorm = normalizeSiteId(site);
      return siteNorm === targetNorm || siteNorm === "all";
    });
  }

  return false;
}

/**
 * Normalize raw product data into a standardized structure.
 */
export function normalizeProduct(raw = {}, defaultCategory = "", defaultSubCategory = "", uidPrefix = "") {
  const title = (raw.title || raw.name || "Untitled Product").trim();
  const slug = raw.slug || makeSlug(title);

  // Extract images array safely
  let images = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    images = raw.images.filter((img) => typeof img === "string" && img.trim() !== "");
  } else if (raw.image && typeof raw.image === "string" && raw.image.trim() !== "") {
    images = [raw.image.trim()];
  } else if (Array.isArray(raw.originalImages) && raw.originalImages.length > 0) {
    images = raw.originalImages.filter((img) => typeof img === "string" && img.trim() !== "");
  }

  const category = (raw.category || defaultCategory || "General").trim();
  const subCategory = (raw.subCategory || raw.subcategory || defaultSubCategory || "General").trim();

  return {
    id: raw.id || raw.categoryProductId || raw.productId || slug,
    uid: raw.uid || `${uidPrefix}-${slug}`,
    categoryProductId: raw.categoryProductId || raw.productId || raw.id || "",
    title,
    name: title,
    slug,
    price: raw.price || "",
    desc: raw.desc || raw.description || "",
    description: raw.desc || raw.description || "",
    capacity: raw.capacity || "",
    throughput: raw.throughput || "",
    instrument: raw.instrument || "",
    model: raw.model || "",
    usage: raw.usage || "",
    brand: raw.brand || "Human Biomedicals",
    parameters: raw.parameters || "",
    automation: raw.automation || "",
    availability: raw.availability || "In Stock",
    size: raw.size || "",
    category,
    subCategory,
    categoryId: raw.categoryId || makeSlug(category),
    subcategoryId: raw.subcategoryId || makeSlug(subCategory),
    companyId: raw.companyId || PRIMARY_COMPANY,
    images,
    image: images[0] || "",
    video: raw.video || "",
    pdf: raw.pdf || "",
    isPublished: raw.isPublished !== false,
    websiteIds: Array.isArray(raw.websiteIds) ? raw.websiteIds : ["all"],
    type: raw.type || "category",
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

/**
 * Fetch master categories and subcategories for a single company in parallel.
 */
async function fetchCompanyMasterCatalog(companyId) {
  const companyProducts = [];
  const companyCategories = new Map();
  let totalRawCategoriesCount = 0;

  try {
    const categoriesSnap = await getDocs(
      collection(db, "companies", companyId, "categories")
    );

    if (!categoriesSnap || !categoriesSnap.docs || categoriesSnap.docs.length === 0) {
      return { products: [], categories: companyCategories, totalRawCategoriesCount: 0 };
    }

    totalRawCategoriesCount = categoriesSnap.docs.length;

    // Filter categories visible on this website
    const visibleCatDocs = categoriesSnap.docs.filter((catDoc) => {
      const catData = catDoc.data() || {};
      return isVisibleOnWebsite(catData, WEBSITE_ID);
    });

    if (visibleCatDocs.length === 0) {
      return { products: [], categories: companyCategories, totalRawCategoriesCount };
    }

    // Fetch all subcategories in parallel across all visible categories
    await Promise.all(
      visibleCatDocs.map(async (catDoc) => {
        const catData = catDoc.data() || {};
        const catName = catData.name || catData.category || catDoc.id;
        const catSlug = catData.slug || makeSlug(catName);

        companyCategories.set(catSlug, {
          id: catDoc.id,
          name: catName,
          category: catName,
          slug: catSlug,
          companyId,
          websiteIds: catData.websiteIds || ["all"],
          subcategories: new Map(),
        });

        try {
          const subSnap = await getDocs(
            collection(db, "companies", companyId, "categories", catDoc.id, "subcategories")
          );

          if (subSnap && subSnap.docs) {
            subSnap.docs.forEach((subDoc) => {
              const subData = subDoc.data() || {};
              const subName = subData.name || subData.subCategory || subDoc.id;
              const subSlug = subData.slug || makeSlug(subName);

              // Check subcategory-level visibility
              if (!isVisibleOnWebsite(subData, WEBSITE_ID)) {
                return;
              }

              const catEntry = companyCategories.get(catSlug);
              if (catEntry && !catEntry.subcategories.has(subSlug)) {
                catEntry.subcategories.set(subSlug, {
                  id: subDoc.id,
                  name: subName,
                  subCategory: subName,
                  slug: subSlug,
                  categoryId: catDoc.id,
                  companyId,
                  websiteIds: subData.websiteIds || ["all"],
                });
              }

              // Process products array inside subcategory document
              const prods = Array.isArray(subData.products) ? subData.products : [];
              prods.forEach((prodRaw, pIdx) => {
                if (isVisibleOnWebsite(prodRaw, WEBSITE_ID)) {
                  const normalized = normalizeProduct(
                    prodRaw,
                    catName,
                    subName,
                    `${companyId}-${catDoc.id}-${subDoc.id}-${pIdx}`
                  );
                  companyProducts.push(normalized);
                }
              });
            });
          }
        } catch (subErr) {
          console.error(`Error fetching subcategories for company ${companyId}, category ${catDoc.id}:`, subErr);
        }
      })
    );
  } catch (compErr) {
    console.error(`Error querying master catalog for company ${companyId}:`, compErr);
  }

  return { products: companyProducts, categories: companyCategories, totalRawCategoriesCount };
}

/**
 * Fetch the master catalog directly from Firestore in parallel without multi-hour stale caching.
 */
async function fetchRawCatalogData() {
  const startTime = performance.now();
  const allProducts = [];
  const categoryMap = new Map();

  // 1. Fetch primary company "human"
  const primaryResult = await fetchCompanyMasterCatalog(PRIMARY_COMPANY);
  primaryResult.products.forEach((p) => allProducts.push(p));
  primaryResult.categories.forEach((catVal, catKey) => {
    categoryMap.set(catKey, catVal);
  });

  // 2. Only check legacy paths if master catalog is completely unpopulated (0 raw categories in Firestore)
  if (primaryResult.totalRawCategoriesCount === 0) {
    try {
      const legacyCatSnap = await getDocs(
        collection(db, "websites", WEBSITE_ID, "pages", "categoryproducts", "categories")
      );

      if (legacyCatSnap && legacyCatSnap.docs && legacyCatSnap.docs.length > 0) {
        await Promise.all(
          legacyCatSnap.docs.map(async (catDoc) => {
            const catData = catDoc.data() || {};
            if (!isVisibleOnWebsite(catData, WEBSITE_ID)) return;

            const catName = catData.category || catDoc.id;
            const catSlug = makeSlug(catName);

            try {
              const subSnap = await getDocs(
                collection(db, "websites", WEBSITE_ID, "pages", "categoryproducts", "categories", catDoc.id, "subcategories")
              );

              subSnap.docs.forEach((subDoc) => {
                const subData = subDoc.data() || {};
                if (!isVisibleOnWebsite(subData, WEBSITE_ID)) return;

                const subName = subData.subCategory || subDoc.id;
                const prods = Array.isArray(subData.products) ? subData.products : [];

                prods.forEach((p, idx) => {
                  if (isVisibleOnWebsite(p, WEBSITE_ID)) {
                    allProducts.push(normalizeProduct(p, catName, subName, `legacy-${catDoc.id}-${subDoc.id}-${idx}`));
                  }
                });
              });
            } catch (e) {
              console.error(`Error reading legacy subcategories for ${catDoc.id}:`, e);
            }
          })
        );
      }
    } catch (legacyErr) {
      console.error("Error reading legacy website catalog:", legacyErr);
    }
  }

  // Deduplicate products by UID/slug
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
  console.log(`[db-server] Fetched ${dedupedProducts.length} active products across ${categoryList.length} categories in ${duration.toFixed(2)}ms`);

  return {
    categoryProducts: dedupedProducts,
    categoryList,
  };
}

/**
 * React request-scoped cache for fast server-side rendering
 */
export const fetchFullCatalog = cache(async () => {
  const result = await fetchRawCatalogData();
  return result.categoryProducts;
});

export const fetchFullCatalogData = cache(async () => {
  return await fetchRawCatalogData();
});

export async function getCategoriesData() {
  const data = await fetchFullCatalogData();
  return {
    categoryList: data.categoryList,
    categoryProducts: data.categoryProducts,
  };
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const products = await fetchFullCatalog();
  const target = normalizeSlug(slug);
  return (
    products.find((p) => {
      if (!p) return false;
      if (normalizeSlug(p.slug) === target) return true;
      if (normalizeSlug(p.title) === target) return true;
      if (p.slug === slug || p.id === slug || p.uid === slug) return true;
      return false;
    }) || null
  );
}

export async function getHomeData() {
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "pages", "home"));
  return snap.exists() ? snap.data() : null;
}

export async function getServicesData() {
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "pages", "services"));
  return snap.exists() ? snap.data().services || [] : [];
}

export async function getContactData() {
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "pages", "contact"));
  return snap.exists() ? snap.data().contactInfo || [] : [];
}

export async function getDistrictData(districtSlug) {
  if (!districtSlug || districtSlug.toLowerCase() === "jaipur") {
    return null;
  }
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", districtSlug));
  return snap.exists() ? snap.data() : null;
}
