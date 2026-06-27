"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import "./product.css";

export default function ProductsPage({
  city = "India",
}) {

  const [products, setProducts] =
    useState([]);

  const [productSearch, setProductSearch] =
    useState("");

  const [categorySearch, setCategorySearch] =
    useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [page, setPage] =
    useState(1);

  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const productsPerPage = 20;

  const makeSlug = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const basePath =
    city && city !== "India"
      ? `/${city.toLowerCase()}`
      : "";

  const getCategory = (item) => {

    const title =
      (item.title || "")
        .toLowerCase();

    if (title.includes("rapid"))
      return "Rapid Test Kits";

    if (title.includes("elisa"))
      return "ELISA Kits";

    if (title.includes("hematology"))
      return "Hematology";

    if (title.includes("electrolyte"))
      return "Electrolyte Reagents";

    if (title.includes("biochemistry"))
      return "Biochemistry";

    if (title.includes("immuno"))
      return "Immunoassay Analyzer";

    return "Other Products";

  };

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const allProducts = [];

        // CATEGORY PRODUCTS
        const categorySnap = await getDocs(
          collection(
            db,
            "websites",
            "humanbiomedicalscoin",
            "pages",
            "categoryproducts",
            "categories"
          )
        );

        categorySnap.forEach((categoryDoc) => {

          const data = categoryDoc.data();

          const products =
            (data.products || [])
              .filter(item => item.isPublished)
              .map((item, index) => ({

                ...item,

                uid: `${categoryDoc.id}-${index}`,

                slug: makeSlug(item.title),

                category:
                  data.category ||
                  categoryDoc.id
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, l => l.toUpperCase()),

              }));

          allProducts.push(...products);

        });

        // OTHER PRODUCTS
        const productSnap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalscoin",
            "pages",
            "products"
          )
        );

        if (productSnap.exists()) {

          const otherProducts =
            (productSnap.data().products || [])
              .filter(item => item.isPublished)
              .map((item, index) => ({

                ...item,

                uid: `other-${index}`,

                slug: makeSlug(item.title),

                category:
                  item.category ||
                  "Other Products",

              }));

          allProducts.push(...otherProducts);

        }

        setProducts(allProducts);

      } catch (err) {

        console.log(err);

      }

    };

    fetchProducts();

  }, []);
  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 400) {

        setShowTopBtn(true);

      } else {

        setShowTopBtn(false);

      }

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  const allGroupedProducts =
    useMemo(() => {

      const obj = {};

      products.forEach((item) => {

        if (!obj[item.category]) {

          obj[item.category] = [];

        }

        obj[item.category].push(item);

      });

      return obj;

    }, [products]);

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (item) => {

          const text = `
            ${item.title}
            ${item.brand}
            ${item.category}
          `.toLowerCase();

          return text.includes(
            productSearch.toLowerCase()
          );

        }
      );

    }, [products, productSearch]);
  useEffect(() => {

    setPage(1);

  }, [productSearch]);
  const groupedProducts =
    useMemo(() => {

      const obj = {};

      filteredProducts.forEach(
        (item) => {

          if (
            !obj[item.category]
          ) {

            obj[item.category] =
              [];

          }

          obj[item.category].push(
            item
          );

        }
      );

      return obj;

    }, [filteredProducts]);

  const categories =
    Object.keys(allGroupedProducts).sort((a, b) => {

      if (a === "Other Products")
        return 1;

      if (b === "Other Products")
        return -1;

      return a.localeCompare(b);

    });

  const filteredCategories =
    categories.filter(
      (category) =>
        category
          .toLowerCase()
          .includes(
            categorySearch.toLowerCase()
          )
    );

  const start =
    (page - 1) *
    productsPerPage;

  const paginated =
    filteredProducts.slice(
      start,
      start +
      productsPerPage
    );

  const paginatedGrouped =
    useMemo(() => {

      const obj = {};

      paginated.forEach(
        (item) => {

          if (
            !obj[item.category]
          ) {

            obj[item.category] =
              [];

          }

          obj[item.category].push(
            item
          );

        }
      );

      return obj;

    }, [paginated]);

  const totalPages =
    Math.ceil(
      filteredProducts.length /
      productsPerPage
    );

  const toggleCategory = (
    category
  ) => {

    if (
      openedCategory ===
      category
    ) {

      setOpenedCategory("");

      setActiveCategory("");

      return;

    }

    setOpenedCategory(
      category
    );

    setActiveCategory(
      category
    );

  };

  const scrollToProduct = (slug, category) => {

    if (openedCategory !== category) {

      setOpenedCategory(category);
      setActiveCategory(category);

      setTimeout(() => {

        const el = document.getElementById(slug);

        if (el) {

          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

        }

      }, 350); // accordion animation complete hone ka wait

      return;

    }

    const el = document.getElementById(slug);

    if (el) {

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  };

  useEffect(() => {

    const handleScroll =
      () => {

        let current = "";

        categories.forEach(
          (
            category
          ) => {

            const section =
              document.getElementById(

                category
                  .replace(
                    /\s+/g,
                    "-"
                  )
                  .toLowerCase()

              );

            if (!section)
              return;

            const top =
              section.getBoundingClientRect()
                .top;

            if (
              top <= 180
            ) {

              current =
                category;

            }

          }
        );

        if (
          current &&
          current !==
          activeCategory
        ) {

          setActiveCategory(
            current
          );

        }

      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, [
    categories,
    activeCategory,
  ]);

  return (

    <main className="products-page">

      <Toaster
        position="top-right"
      />

      <div className="container-custom">

        <div className="products-header">

          <span className="section-subtitle">

            OUR PRODUCTS IN {city.toUpperCase()}

          </span>

          <h1 className="products-title mt-4">

            Biomedical Products in {city}

          </h1>

          <p className="products-desc">

            Explore advanced biomedical solutions trusted by hospitals.

          </p>

        </div>

        <div className="products-wrapper">

          <div className="category-sidebar">
            {/* =========================
                LEFT SIDEBAR
          ========================= */}

            <div className="category-sidebar">

              <div className="sidebar-title">

                Categories

              </div>

              <div className="sidebar-search">

                <input
                  type="text"
                  placeholder="Search Product..."
                  value={categorySearch}
                  onChange={(e) =>
                    setCategorySearch(e.target.value)
                  }
                />

              </div>

              <div className="category-list">

                {filteredCategories.map((category) => (

                  <div
                    key={category}
                    className="category-item"
                  >

                    <button
                      className={`category-btn ${activeCategory ===
                        category
                        ? "active"
                        : ""
                        }`}
                      onClick={() =>
                        toggleCategory(
                          category
                        )
                      }
                    >

                      <span>

                        {openedCategory ===
                          category ? (
                          "▼"
                        ) : (
                          "▶"
                        )}

                        {" "}

                        {category}

                      </span>

                      <span className="count">
                        {
                          allGroupedProducts[
                            category
                          ]?.length || 0
                        }
                      </span>

                    </button>

                    <div
                      className="category-content"
                      style={{

                        maxHeight:

                          openedCategory ===
                            category

                            ? allGroupedProducts[
                              category
                            ].length *
                            42 +
                            "px"

                            : "0px",

                      }}
                    >

                      {allGroupedProducts[
                        category
                      ].map((item) => (

                        <button
                          key={item.uid}
                          className="product-link"
                          onClick={() =>
                            scrollToProduct(
                              item.slug,
                              category
                            )
                          }
                        >

                          {item.title}

                        </button>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>





          {/* =========================
              RIGHT SIDE
        ========================= */}

          <div className="right-products">

            <div className="filter-card">

              <div className="row">

                <div className="col-lg-10">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Product..."
                    value={productSearch}
                    onChange={(e) =>
                      setProductSearch(e.target.value)
                    }
                  />

                </div>


              </div>

            </div>
            {filteredProducts.length === 0 && (

              <div className="no-products">

                <div className="no-products-icon">
                  🔍
                </div>

                <h2>
                  No Products Found
                </h2>

                <p>
                  We couldn't find any products matching your search.
                </p>

                <button
                  className="reset-search-btn"
                  onClick={() => setProductSearch("")}
                >
                  View All Products
                </button>

              </div>

            )}
            {Object.entries(
              paginatedGrouped
            ).map(
              ([category, list]) => (

                <div
                  key={category}
                  id={category
                    .replace(/\s+/g, "-")
                    .toLowerCase()}
                  className="product-section"
                >

                  <div className="section-title">

                    <h3>

                      {category}

                    </h3>

                    <span>

                      {
                        groupedProducts[
                          category
                        ]?.length
                      }{" "}
                      Products

                    </span>

                  </div>

                  {list.map(
                    (product) => (

                      <div
                        key={
                          product.uid
                        }
                        id={
                          product.slug
                        }
                        className="product-list-card"
                      >

                        <div className="product-card-grid">

                          {/* IMAGE */}

                          <div className="list-image">

                            <img
                              src={
                                product.image ||
                                "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800"
                              }
                              alt={product.title}
                            />

                          </div>

                          {/* CONTENT */}

                          <div className="list-content">

                            <h4>

                              {product.title}

                            </h4>

                            <p>

                              {product.desc ||
                                product.description ||
                                "No description available."}

                            </p>

                            <div className="spec-grid">

                              <div>

                                <b>

                                  Brand

                                </b>

                                <span>

                                  {product.brand || "-"}

                                </span>

                              </div>

                              <div>

                                <b>

                                  Model

                                </b>

                                <span>

                                  {product.model || "-"}

                                </span>

                              </div>

                              <div>

                                <b>

                                  Instrument

                                </b>

                                <span>

                                  {product.instrument || "-"}

                                </span>

                              </div>

                              <div>

                                <b>

                                  Throughput

                                </b>

                                <span>

                                  {product.throughput || "-"}

                                </span>

                              </div>

                            </div>

                          </div>

                          {/* BUTTON */}

                          <div className="product-action">

                            <Link
                              href={`${basePath}/items/${product.slug}`}
                              className="btn-view"
                            >

                              View Details

                            </Link>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )
            )}
            {/* ===========================
              PAGINATION
        =========================== */}

            <div className="pagination-card">

              <div className="pagination-wrapper">

                <div className="page-size">

                  <span>
                    Show
                  </span>

                  <select
                    value={productsPerPage}
                    disabled
                  >

                    <option>
                      {productsPerPage}
                    </option>

                  </select>

                </div>

                <div className="simple-pagination">

                  <button
                    disabled={
                      page === 1
                    }
                    onClick={() => {

                      setPage(
                        (p) => p - 1
                      );

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });

                    }}
                  >

                    ◀

                  </button>

                  <span>

                    {page} / {totalPages}

                  </span>

                  <button
                    disabled={
                      page === totalPages
                    }
                    onClick={() => {

                      setPage(
                        (p) => p + 1
                      );

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });

                    }}
                  >

                    ▶

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
      {showTopBtn && (

        <button
          className="back-to-top-btn"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >

          ↑

        </button>

      )}
    </main>

  );

}