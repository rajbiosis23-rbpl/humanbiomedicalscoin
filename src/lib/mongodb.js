import { MongoClient } from "mongodb";
import { WEBSITE_ID, isItemVisibleOnWebsite, normalizeProduct, makeSlug } from "./catalog-utils.js";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://rajbiosis15_db_user:R7jmlgZ3RfeB0MEz@superadminrbpl.aneatej.mongodb.net/company_master_cms?retryWrites=true&w=majority";

const DB_NAME = process.env.MONGODB_DB || "company_master_cms";

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Returns connected MongoDB client
 */
export async function getMongoClient() {
  return await clientPromise;
}

/**
 * Returns target database instance
 */
export async function getDb(dbName = DB_NAME) {
  const c = await getMongoClient();
  return c.db(dbName);
}

/**
 * Save form enquiry (contact or product query) directly to MongoDB queries collection
 */
export async function saveQueryToMongo(payload = {}) {
  try {
    const db = await getDb();
    const targetWebsiteId = payload.websiteId || WEBSITE_ID;
    const queryId = `query_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const doc = {
      _id: `${targetWebsiteId}_${queryId}`,
      queryId,
      websiteId: targetWebsiteId,
      type: payload.type || (payload.productName || payload.productSlug ? "product" : "contact"),
      name: (payload.name || "").trim(),
      email: (payload.email || "").trim(),
      phone: String(payload.phone || "").trim(),
      message: (payload.message || "").trim(),
      status: "unread",
      createdAt: now,
      data: {
        ...payload,
        id: queryId,
        queryId,
        websiteId: targetWebsiteId,
        createdAt: now,
      },
    };

    const res = await db.collection("queries").insertOne(doc);
    return {
      success: true,
      queryId,
      insertedId: res.insertedId,
      message: "Query saved to MongoDB successfully",
    };
  } catch (error) {
    console.error("[mongodb] Error saving query:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Fetch dynamic page/site data directly from MongoDB
 */
export async function getSiteDataFromMongo(websiteId = WEBSITE_ID, type = "home") {
  try {
    const db = await getDb();
    const collectionName = type === "home" ? "home" : type === "contact" ? "contact" : type === "services" ? "services" : "pages";

    const query = {
      $or: [
        { websiteId },
        { id: websiteId },
        { _id: websiteId },
        { slug: websiteId },
      ],
    };

    if (collectionName === "pages") {
      query.page = type;
    }

    const doc = await db.collection(collectionName).findOne(query);
    if (doc) {
      const { _id, ...cleanData } = doc;
      return { success: true, data: cleanData };
    }
  } catch (err) {
    console.error(`[mongodb] Error fetching ${type} for ${websiteId}:`, err);
  }
  return { success: false, data: null };
}

/**
 * Fallback to fetch catalog from MongoDB human_products collection
 */
export async function getCatalogFromMongo(websiteId = WEBSITE_ID) {
  try {
    const db = await getDb();
    const categories = await db.collection("human_products").find({}).toArray();

    const allProducts = [];
    const categoryList = [];

    for (const cat of categories) {
      const catName = cat.name || cat.category || cat.title || "General";
      const catSlug = cat.slug || makeSlug(catName);

      const cleanSubcategories = [];
      const subcategories = Array.isArray(cat.subcategories) ? cat.subcategories : [];

      for (const sub of subcategories) {
        const subName = sub.name || sub.subCategory || "General";
        const subSlug = sub.slug || makeSlug(subName);

        if (!isItemVisibleOnWebsite(sub, websiteId)) continue;

        cleanSubcategories.push({
          id: sub.id || subSlug,
          name: subName,
          slug: subSlug,
          categoryId: catSlug,
        });

        const products = Array.isArray(sub.products) ? sub.products : [];
        for (const [pIdx, prod] of products.entries()) {
          if (isItemVisibleOnWebsite(prod, websiteId)) {
            const normalized = normalizeProduct(
              prod,
              catName,
              subName,
              `human-${catSlug}-${subSlug}-${pIdx}`
            );
            allProducts.push(normalized);
          }
        }
      }

      if (cleanSubcategories.length > 0) {
        categoryList.push({
          id: cat._id || catSlug,
          name: catName,
          slug: catSlug,
          subcategories: cleanSubcategories,
        });
      }
    }

    // Deduplicate
    const seen = new Set();
    const deduped = [];
    for (const p of allProducts) {
      const key = p.slug || p.id;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(p);
      }
    }

    return {
      success: true,
      count: deduped.length,
      categoryProducts: deduped,
      products: deduped,
      categoryList,
    };
  } catch (err) {
    console.error("[mongodb] Error getCatalogFromMongo:", err);
    return {
      success: false,
      count: 0,
      categoryProducts: [],
      products: [],
      categoryList: [],
    };
  }
}
