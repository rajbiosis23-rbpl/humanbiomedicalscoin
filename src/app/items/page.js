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
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import "./product.css";

export default function ProductsPage({
  city = "India",
}) {

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

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

    const fetchProducts =
      async () => {

        try {

          const snap =
            await getDoc(
              doc(
                db,
                "websites",
                "humanbiomedicalscoin",
                "pages",
                "products"
              )
            );

          if (snap.exists()) {

            const raw =
              snap.data()
                ?.products || [];

            const published =
              raw
                .filter(
                  (item) =>
                    item.isPublished
                )
                .map(
                  (
                    item,
                    index
                  ) => ({

                    ...item,

                    uid:
                      index,

                    slug:
                      makeSlug(
                        item.title
                      ),

                    category:
                      item.category ||
                      getCategory(
                        item
                      ),

                  })
                );

            setProducts(
              published
            );

          }

        } catch (err) {

          console.log(err);

        }

      };

    fetchProducts();

  }, []);

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
            search.toLowerCase()
          );

        }
      );

    }, [products, search]);

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
    Object.keys(
      groupedProducts
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
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="category-list">

              {Object.keys(
                groupedProducts
              ).map((category) => (

                <div
                  key={category}
                  className="category-item"
                >

                  <button
                    className={`category-btn ${
                      activeCategory ===
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
                        groupedProducts[
                          category
                        ].length
                      }

                    </span>

                  </button>

                  <div
                    className="category-content"
                    style={{

                      maxHeight:

                        openedCategory ===
                        category

                          ? groupedProducts[
                              category
                            ].length *
                              42 +
                            "px"

                          : "0px",

                    }}
                  >

                    {groupedProducts[
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
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>


            </div>

          </div>
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
                onClick={() =>
                  setPage(
                    (p) => p - 1
                  )
                }
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
                onClick={() =>
                  setPage(
                    (p) => p + 1
                  )
                }
              >

                ▶

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</main>

);

}