import {
  fetchFullCatalog as fetchFullCatalogDb,
  fetchFullCatalogData as fetchFullCatalogDataDb,
  getCategoriesData as getCategoriesDataDb,
  getProductBySlug as getProductBySlugDb,
  getHomeData as getHomeDataDb,
  getServicesData as getServicesDataDb,
  getContactData as getContactDataDb,
  getDistrictData as getDistrictDataDb,
} from "./db-server.js";

export const fetchFullCatalog = fetchFullCatalogDb;
export const fetchFullCatalogData = fetchFullCatalogDataDb;
export const getCategoriesData = getCategoriesDataDb;
export const getProductBySlug = getProductBySlugDb;
export const getHomeData = getHomeDataDb;
export const getServicesData = getServicesDataDb;
export const getContactData = getContactDataDb;
export const getDistrictData = getDistrictDataDb;
