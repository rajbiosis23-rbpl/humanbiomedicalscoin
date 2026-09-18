import { db, doc, getDoc, getDocs, collection } from "./firebase.js";
import {
  fetchFullCatalog as fetchFullCatalogDb,
  fetchFullCatalogData as fetchFullCatalogDataDb,
  getCategoriesData as getCategoriesDataDb,
  getProductBySlug as getProductBySlugDb,
  getHomeData as getHomeDataDb,
  getServicesData as getServicesDataDb,
  getContactData as getContactDataDb,
  getDistrictData as getDistrictDataDb,
  makeSlug as makeSlugDb,
  normalizeSlug as normalizeSlugDb,
  normalizeProduct as normalizeProductDb,
  isVisibleOnWebsite as isVisibleOnWebsiteDb,
  WEBSITE_ID,
} from "./db-server.js";

// Re-exports from db-server
export const makeSlug = makeSlugDb;
export const normalizeSlug = normalizeSlugDb;
export const normalizeProduct = normalizeProductDb;
export const isVisibleOnWebsite = isVisibleOnWebsiteDb;
export const fetchFullCatalog = fetchFullCatalogDb;
export const fetchFullCatalogData = fetchFullCatalogDataDb;
export const getCategoriesData = getCategoriesDataDb;
export const getProductBySlug = getProductBySlugDb;

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

const docCache = {};

/**
 * Fetch a single document and cache its promise/data.
 */
export async function fetchDocCached(path) {
  if (docCache[path]) {
    return docCache[path];
  }
  if (!docCache[path + "_promise"]) {
    docCache[path + "_promise"] = (async () => {
      try {
        const parts = path.split("/");
        const docRef = doc(db, ...parts);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          docCache[path] = data;
          return data;
        }
        return null;
      } catch (err) {
        console.error(`Error fetching doc at ${path}:`, err);
        delete docCache[path + "_promise"];
        throw err;
      }
    })();
  }
  return docCache[path + "_promise"];
}

/**
 * Helpers for cached document retrieval across pages
 */
export async function fetchHomeData() {
  return getHomeDataDb();
}

export async function fetchContactData() {
  return getContactDataDb();
}

export async function fetchServicesData() {
  return getServicesDataDb();
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  return getDistrictDataDb(district);
}

let districtsListPromise = null;

export async function fetchDistrictsList() {
  if (districtsListPromise) {
    return districtsListPromise;
  }
  districtsListPromise = (async () => {
    try {
      const snapshot = await getDocs(
        collection(
          db,
          "websites",
          WEBSITE_ID,
          "districts"
        )
      );
      return snapshot.docs.map((doc) => doc.id);
    } catch (error) {
      console.error("Error fetching districts list from Firestore:", error);
      districtsListPromise = null;
      throw error;
    }
  })();
  return districtsListPromise;
}
