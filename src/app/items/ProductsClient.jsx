"use client";
import "./page.css"
import React, { useEffect, useMemo, useState, useCallback, memo, Profiler } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  Search,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";

import ProductCard from "../../components/common/ProductCard";

// 1. Memoized Product Link Component
const ProductLink = memo(function ProductLink({ item, category, scrollToProduct }) {
  return (
    <button
      onClick={() => scrollToProduct(item.slug, category)}
      className="block w-full text-left py-1 text-sm text-slate-500 hover:text-sky-700 hover:translate-x-1 transition-all duration-200 font-medium"
    >
      • {item.title}
    </button>
  );
});

// 2. Memoized Subcategory Component (renders product list only when expanded)
const SubCategoryItem = memo(function SubCategoryItem({
  category,
  subCategory,
  subList,
  isSubOpened,
  toggleSubCategory,
  scrollToProduct,
}) {
  return (
    <div className="subcategory-wrapper">

      {/* Subcategory Header */}

      <button
        onClick={() =>
          toggleSubCategory(category, subCategory)
        }
        className="subcategory-btn"
      >

        <span className="subcategory-left">

          <span
            className={`subcategory-arrow ${isSubOpened
              ? "arrow-open"
              : ""
              }`}
          >
            <ChevronRight size={12} />
          </span>

          {subCategory}

        </span>

        <span className="subcategory-count">

          {subList.length}

        </span>

      </button>

      {/* Product List */}

      <div
        className={`subcategory-content ${isSubOpened
          ? "subcategory-open"
          : "subcategory-close"
          }`}
      >

        {isSubOpened && (

          <div className="subcategory-scroll">

            {subList.map((item) => (

              <ProductLink
                key={item.uid}
                item={item}
                category={category}
                scrollToProduct={scrollToProduct}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
});

// 3. Memoized Category Component (renders subcategories only when expanded)
const CategoryItem = memo(function CategoryItem({
  category,
  isOpened,
  isActive,
  subcategories,
  categoryProductCount,
  toggleCategory,
  toggleSubCategory,
  openedSubCategories,
  scrollToProduct,
}) {
  return (
    <div className="category-group">

      <button
        onClick={() => toggleCategory(category)}
        className={`category-btn ${isActive
          ? "category-active"
          : "category-inactive"
          }`}
      >

        <span className="category-left">

          <span
            className={`category-arrow ${isOpened
              ? "arrow-open"
              : ""
              }`}
          >
            <ChevronRight
              size={16}
              className={`${isActive
                ? "arrow-active"
                : "arrow-inactive"
                }`}
            />
          </span>

          {category}

        </span>

        <span
          className={`category-count ${isActive
            ? "count-active"
            : "count-inactive"
            }`}
        >

          {categoryProductCount}

        </span>

      </button>

      {/* Sub Categories */}

      <div
        className={`category-content ${isOpened
          ? "category-open"
          : "category-close"
          }`}
      >

        {isOpened && (

          <div className="subcategory-list">

            {Object.entries(subcategories || {}).map(
              ([subCategory, subList]) => {

                const subKey =
                  `${category}-${subCategory}`;

                const isSubOpened =
                  !!openedSubCategories[subKey];

                return (

                  <SubCategoryItem
                    key={subKey}
                    category={category}
                    subCategory={subCategory}
                    subList={subList}
                    isSubOpened={isSubOpened}
                    toggleSubCategory={toggleSubCategory}
                    scrollToProduct={scrollToProduct}
                  />

                );

              }
            )}

          </div>

        )}

      </div>

    </div>
  );
});

export default function ProductsClient({ initialProducts = [], district = null, city = null }) {
  const [categorySearch, setCategorySearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [openedSubCategories, setOpenedSubCategories] = useState({});
  const [pendingScroll, setPendingScroll] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);

  // Read category / search URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category") || params.get("search");
      if (catParam) {
        setSearchInput(catParam);
        setProductSearch(catParam);
        setOpenedCategory(catParam);
        setActiveCategory(catParam);
      }
    }
  }, []);

  // Debounce search term updates to make search typing instant
  useEffect(() => {
    const timer = setTimeout(() => {
      setProductSearch(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Combined single-pass product filtering, grouping, category count, and sorting for maximum performance
  const { filteredProducts, sortedGroupedProducts, categoryCounts } = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    const firstSlug = initialProducts[0]?.slug || "";
    const cacheKey = `${initialProducts.length}-${firstSlug}-${query}`;

    if (!globalThis._productsMemoCache) {
      globalThis._productsMemoCache = new Map();
    }

    if (globalThis._productsMemoCache.has(cacheKey)) {
      return globalThis._productsMemoCache.get(cacheKey);
    }

    const start = performance.now();
    const filtered = query
      ? initialProducts.filter((item) => {
        const title = (item.title || "").toLowerCase();
        const brand = (item.brand || "").toLowerCase();
        const model = (item.model || "").toLowerCase();
        const category = (item.category || "").toLowerCase();
        const subCategory = (item.subCategory || "").toLowerCase();

        return (
          title.includes(query) ||
          brand.includes(query) ||
          model.includes(query) ||
          category.includes(query) ||
          subCategory.includes(query)
        );
      })
      : initialProducts;

    const grouped = {};
    const counts = {};

    filtered.forEach((item) => {
      const cat = item.category || "Other Products";
      const sub = item.subCategory || cat;

      if (!grouped[cat]) {
        grouped[cat] = {};
        counts[cat] = 0;
      }
      if (!grouped[cat][sub]) {
        grouped[cat][sub] = [];
      }

      grouped[cat][sub].push(item);
      counts[cat]++;
    });

    const entries = Object.entries(grouped);
    entries.sort(([a], [b]) => {
      if (a === "Other Products") return 1;
      if (b === "Other Products") return -1;
      return a.localeCompare(b);
    });

    const sortedObj = {};
    for (const [cat, subObj] of entries) {
      const subEntries = Object.entries(subObj);
      subEntries.sort(([a], [b]) => {
        if (a === cat) return -1;
        if (b === cat) return 1;
        return a.localeCompare(b);
      });
      sortedObj[cat] = Object.fromEntries(subEntries);
    }

    const end = performance.now();
    console.log(`[ProductsClient] Grouping, filtering, and sorting completed in ${(end - start).toFixed(2)}ms`);

    const result = {
      filteredProducts: filtered,
      sortedGroupedProducts: sortedObj,
      categoryCounts: counts,
    };

    globalThis._productsMemoCache.set(cacheKey, result);
    return result;
  }, [initialProducts, productSearch]);

  const getCategoryProductCount = useCallback((categoryName) => {
    return categoryCounts[categoryName] || 0;
  }, [categoryCounts]);

  const toggleCategory = useCallback((category) => {
    setOpenedCategory((prev) => (prev === category ? "" : category));
  }, []);

  const toggleSubCategory = useCallback((category, subCategory) => {
    const key = `${category}-${subCategory}`;
    setOpenedSubCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const scrollToProduct = useCallback((slug, category) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setPendingScroll(slug);

    // Auto-expand the target subcategory when scrolling to its product
    const prod = initialProducts.find((p) => p.slug === slug);
    if (prod && prod.subCategory) {
      const subKey = `${category}-${prod.subCategory}`;
      setOpenedSubCategories((prev) => ({
        ...prev,
        [subKey]: true,
      }));
    }
  }, [initialProducts]);

  // Scroll to selected sidebar item when category expansion finishes
  useEffect(() => {
    if (!pendingScroll) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(pendingScroll);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setPendingScroll(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [openedCategory, pendingScroll]);

  // Scroll back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Measure hydration completion time
  useEffect(() => {
    if (typeof window !== "undefined" && window.performance) {
      const navigationStart = window.performance.timing?.navigationStart || 0;
      if (navigationStart) {
        const timeSinceNavigation = Date.now() - navigationStart;
        console.log(`[ProductsClient] Hydration completed in ${timeSinceNavigation}ms since navigation start`);
      }
    }
  }, []);

  const onRenderCallback = (id, phase, actualDuration) => {
    console.log(`[React Profiler] ${id} render time (${phase}): ${actualDuration.toFixed(2)}ms`);
  };

  return (
    <Profiler
      id="ProductsLayout"
      onRender={onRenderCallback}
    >

      {/* Banner */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalEquipmentSupplier",
            name: "Human Biomedicals",
            url: "https://humanbiomedicals.org",
            areaServed: city,
            description: `Medical laboratory and hospital equipment in ${city}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: city,
              addressCountry: "India",
            },
          }),
        }}
      />

      <div className="products-page">

        <Toaster
          position="top-right"
          toastOptions={{
            className: "custom-toast",
          }}
        />

        {/* HERO */}

        <section className="products-hero">

          <div className="hero-shape hero-shape-left"></div>

          <div className="hero-shape hero-shape-right"></div>

          <div className="container-custom hero-content">

            <span className="hero-badge">
              Human Biomedicals LLP
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7 }}
              className="products-hero-title"
            >

              {city
                ? `Buy Medical Laboratory Equipment in ${city}`
                : "Medical Laboratory Equipment"}

            </motion.h1>

            <p className="products-hero-desc">

              Premium laboratory instruments,
              diagnostic systems and hospital equipment.

            </p>


          </div>

        </section>
        {/* Products */}
        <section className="products-section">

          {/* Search */}

          <div className="products-search">
            <Search
              size={22}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              className="search-input"
            />

          </div>

          {/* Layout */}
          <div className="products-layout">

            {/* Sidebar */}

            <aside className="products-sidebar">

              {/* Sticky Header */}

              <div className="sidebar-header">

                <h3 className="sidebar-title">

                  <span>
                    Categories
                  </span>

                  <span className="sidebar-count">

                    {Object.keys(sortedGroupedProducts).length}

                  </span>

                </h3>

                {/* Search */}

                <div className="sidebar-search">

                  <Search
                    size={16}
                    className="sidebar-search-icon"
                  />

                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) =>
                      setCategorySearch(e.target.value)
                    }
                    className="sidebar-search-input"
                  />

                </div>

              </div>

              <div className="sidebar-categories">

                {Object.keys(sortedGroupedProducts)
                  .filter((category) =>
                    category
                      .toLowerCase()
                      .includes(
                        categorySearch.toLowerCase()
                      )
                  )
                  .map((category) => {

                    const isOpened =
                      openedCategory === category;

                    const isActive =
                      activeCategory === category;

                    const subcategories =
                      sortedGroupedProducts[category] || {};

                    const count =
                      getCategoryProductCount(category);

                    return (

                      <CategoryItem
                        key={category}
                        category={category}
                        isOpened={isOpened}
                        isActive={isActive}
                        subcategories={subcategories}
                        categoryProductCount={count}
                        toggleCategory={toggleCategory}
                        toggleSubCategory={toggleSubCategory}
                        openedSubCategories={openedSubCategories}
                        scrollToProduct={scrollToProduct}
                      />

                    );

                  })}

              </div>

            </aside>

            {/* RIGHT SIDE START */}
            <div className="products-content">

              {filteredProducts.length === 0 ? (

                <div className="no-products">

                  <div className="no-products-icon">
                    🔍
                  </div>

                  <h2 className="no-products-title">
                    Product Not Found
                  </h2>

                  <p className="no-products-text">

                    {"We couldn't find any products matching"}

                    <span className="highlight-search">

                      {" \"" + productSearch + "\" "}

                    </span>

                    . Please try another keyword or browse categories.

                  </p>

                  <button
                    onClick={() => {
                      setSearchInput("");
                      setProductSearch("");
                    }}
                    className="view-all-btn"
                  >

                    View All Products

                  </button>

                </div>

              ) : (

                Object.entries(sortedGroupedProducts).map(

                  ([category, subcategoriesObj]) => (

                    <section
                      key={category}
                      id={category
                        .replace(/\s+/g, "-")
                        .toLowerCase()}
                      className="category-section"
                    >

                      {/* Category Header */}

                      <div className="category-header">

                        <h2 className="category-title">

                          {category}

                        </h2>

                        <span className="category-total">

                          {Object.values(subcategoriesObj).reduce(
                            (sum, list) => sum + list.length,
                            0
                          )}

                          {" "}Products

                        </span>

                      </div>

                      {/* Subcategories */}

                      <div className="subcategory-wrapper-list">

                        {Object.entries(subcategoriesObj).map(

                          ([subCategory, list]) => (

                            <div
                              key={subCategory}
                              className="subcategory-block"
                            >

                              <div className="subcategory-header">

                                <h3 className="subcategory-title">

                                  {subCategory}

                                </h3>

                                <span className="subcategory-badge">

                                  {list.length}

                                  {" "}

                                  {list.length === 1
                                    ? "Product"
                                    : "Products"}

                                </span>

                              </div>

                              <div className="product-list">

                                {list
                                  .slice(0, 12)
                                  .map((product) => (

                                    <ProductCard
                                      key={product.uid}
                                      product={product}
                                      district={district}
                                    />

                                  ))}

                              </div>

                            </div>

                          )

                        )}

                      </div>

                    </section>

                  )

                )

              )}

            </div>
          </div>
        </section>

        {/* Why Choose Products */}
        <section className="features-section">

          <div className="container-custom">

            <div className="features-grid">

              {[
                {
                  icon: <ShieldCheck size={30} />,
                  title: "Certified Quality",
                },
                {
                  icon: <Truck size={30} />,
                  title: "Fast Delivery",
                },
                {
                  icon: <BadgeCheck size={30} />,
                  title: "Trusted Support",
                },
                {
                  icon: <PackageCheck size={30} />,
                  title: "Premium Equipment",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="feature-card"
                >

                  <div className="feature-icon">

                    {item.icon}

                  </div>

                  <h3 className="feature-title">

                    {item.title}

                  </h3>

                </div>

              ))}

            </div>

          </div>

        </section>



        {/* Back To Top */}
        {showTopButton && (

          <button
            onClick={scrollToTop}
            className="scroll-top-btn"
          >

            <ChevronUp size={24} />

          </button>

        )}
      </div>
    </Profiler>
  );
}
