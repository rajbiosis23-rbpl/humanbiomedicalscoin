/**
 * Pure Client-Safe Catalog & Visibility Utilities
 * No Node.js built-ins (node:fs / node:sqlite) are imported here.
 */

export const WEBSITE_ID = "humanbiomedicalscoin";
export const PRIMARY_COMPANY = "human";
export const ALL_COMPANIES = ["human", "global", "rajbiosis"];

/**
 * Normalizes URL/domain/website ID by stripping protocols, www, dots, dashes, slashes and spaces.
 * e.g. "https://www.humanbiomedicals.co.in/" -> "humanbiomedicalscoin"
 */
export function normalizeDomainId(id = "") {
  return String(id || "")
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Detects the company ID from website domain/ID
 */
export function detectCompanyId(domain = WEBSITE_ID) {
  const norm = normalizeDomainId(domain);
  if (norm.includes("human")) return "human";
  if (norm.includes("global")) return "global";
  if (norm.includes("rajbiosis")) return "rajbiosis";
  return PRIMARY_COMPANY;
}

/**
 * Creates clean URL-friendly slug
 */
export function makeSlug(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeDecode(str = "") {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Safely decodes and normalizes slugs for robust matching
 */
export function normalizeSlug(s = "") {
  return safeDecode(String(s || ""))
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Checks if an item (category, subcategory, or product) is visible on this website.
 * Strict cascading visibility rules applied:
 * 1. item.isPublished === false -> HIDE
 * 2. item.status === "inactive" || "draft" -> HIDE
 * 3. item.websiteIds === [] (0 sites assigned) -> HIDE
 * 4. item.websiteIds includes "all" or normalized website ID -> SHOW
 * 5. item.websiteIds is undefined/null (legacy) -> SHOW
 */
export function isItemVisibleOnWebsite(item, websiteId = WEBSITE_ID) {
  if (!item) return false;

  // 1. Explicitly unpublished
  if (item.isPublished === false) return false;

  // 2. Inactive or draft status
  if (item.status === "inactive" || item.status === "draft") return false;

  const targetNorm = normalizeDomainId(websiteId || WEBSITE_ID);

  // 3. If websiteIds is missing, default to visible
  if (item.websiteIds === undefined || item.websiteIds === null) {
    return true;
  }

  // 4. Array check
  if (Array.isArray(item.websiteIds)) {
    // Empty array [] -> 0 websites selected -> HIDDEN FROM ALL
    if (item.websiteIds.length === 0) {
      return false;
    }
    // "all" assigned -> visible on all websites
    if (item.websiteIds.includes("all")) {
      return true;
    }
    // Check if target website is in websiteIds
    return item.websiteIds.some((site) => {
      const siteNorm = normalizeDomainId(site);
      return siteNorm === targetNorm || siteNorm === "all";
    });
  }

  return true;
}

export const isVisibleOnWebsite = isItemVisibleOnWebsite;

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
    status: raw.status || "active",
  };
}
