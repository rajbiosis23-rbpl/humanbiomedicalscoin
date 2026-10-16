"use client";
import "./page.css";
import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
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
  X,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../../components/common/ProductCard";
import { fetchFullCatalog } from "@/lib/data-fetcher";

// 1. Memoized Product Link Component
const ProductLink = memo(function ProductLink({
  item,
  category,
  subCategory,
  scrollToProduct,
  isHighlighted,
}) {
  return (
    <button
      onClick={() => scrollToProduct(item.slug, category, subCategory)}
      className={`block w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all duration-200 font-medium ${
        isHighlighted
          ? "bg-rose-100 text-[#b03333] font-bold translate-x-1"
          : "text-slate-600 hover:text-[#b03333] hover:bg-slate-50 hover:translate-x-1"
      }`}
    >
      • {item.title}
    </button>
  );
});

// 2. Memoized Subcategory Component
const SubCategoryItem = memo(function SubCategoryItem({
  category,
  subCategory,
  subList,
  isSubOpened,
  isSubSelected,
  toggleSubCategory,
  selectSubCategory,
  scrollToProduct,
  highlightedProductId,
}) {
  return (
    <div className="subcategory-wrapper">
      {/* Subcategory Header */}
      <button
        onClick={() => {
          selectSubCategory(category, subCategory);
        }}
        className={`subcategory-btn group ${
          isSubSelected ? "text-[#c81212] font-extrabold bg-rose-50/70 rounded-lg px-2" : ""
        }`}
      >
        <span className="subcategory-left">
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleSubCategory(category, subCategory);
            }}
            className={`subcategory-arrow p-0.5 rounded hover:bg-rose-100 ${
              isSubOpened ? "arrow-open" : ""
            }`}
            title="Expand/Collapse products"
          >
            <ChevronRight size={13} />
          </span>

          <span className="text-left leading-tight text-xs">{subCategory}</span>
        </span>

        <span
          className={`subcategory-count ${
            isSubSelected ? "bg-[#b03333] text-white" : ""
          }`}
        >
          {subList.length}
        </span>
      </button>

      {/* Product List */}
      <div
        className={`subcategory-content ${
          isSubOpened ? "subcategory-open" : "subcategory-close"
        }`}
      >
        {isSubOpened && (
          <div className="subcategory-scroll space-y-0.5 my-1 pl-1">
            {subList.map((item, idx) => (
              <ProductLink
                key={item.uid || `${item.id || item.slug || "link"}-${idx}`}
                item={item}
                category={category}
                subCategory={subCategory}
                scrollToProduct={scrollToProduct}
                isHighlighted={highlightedProductId === item.slug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// 3. Memoized Category Component
const CategoryItem = memo(function CategoryItem({
  category,
  isOpened,
  isActive,
  isCategorySelected,
  subcategories,
  categoryProductCount,
  toggleCategory,
  selectCategory,
  toggleSubCategory,
  selectSubCategory,
  openedSubCategories,
  selectedSubCategory,
  scrollToProduct,
  highlightedProductId,
}) {
  return (
    <div className="category-group">
      <button
        onClick={() => {
          selectCategory(category);
        }}
        className={`category-btn ${
          isCategorySelected || isActive
            ? "category-active shadow-sm"
            : "category-inactive"
        }`}
      >
        <span className="category-left">
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleCategory(category);
            }}
            className={`category-arrow p-0.5 rounded hover:bg-rose-100 ${
              isOpened ? "arrow-open" : ""
            }`}
            title="Expand/Collapse subcategories"
          >
            <ChevronRight
              size={16}
              className={`${
                isCategorySelected || isActive
                  ? "arrow-active"
                  : "arrow-inactive"
              }`}
            />
          </span>

          <span className="text-left font-semibold">{category}</span>
        </span>

        <span
          className={`category-count ${
            isCategorySelected || isActive
              ? "count-active font-bold"
              : "count-inactive"
          }`}
        >
          {categoryProductCount}
        </span>
      </button>

      {/* Sub Categories */}
      <div
        className={`category-content ${
          isOpened ? "category-open" : "category-close"
        }`}
      >
        {isOpened && (
          <div className="subcategory-list space-y-1">
            {Object.entries(subcategories || {}).map(
              ([subCategory, subList]) => {
                const subKey = `${category}-${subCategory}`;
                const isSubOpened = !!openedSubCategories[subKey];
                const isSubSelected = selectedSubCategory === subCategory;

                return (
                  <SubCategoryItem
                    key={subKey}
                    category={category}
                    subCategory={subCategory}
                    subList={subList}
                    isSubOpened={isSubOpened}
                    isSubSelected={isSubSelected}
                    toggleSubCategory={toggleSubCategory}
                    selectSubCategory={selectSubCategory}
                    scrollToProduct={scrollToProduct}
                    highlightedProductId={highlightedProductId}
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

export default function ProductsClient({
  initialProducts = [],
  district = null,
  city = null,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [categorySearch, setCategorySearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [openedSubCategories, setOpenedSubCategories] = useState({});
  const [pendingScroll, setPendingScroll] = useState(null);
  const [highlightedProductId, setHighlightedProductId] = useState("");
  const [showTopButton, setShowTopButton] = useState(false);

  // Sync when initialProducts prop updates
  useEffect(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  // Live background sync only once if initial is empty
  const syncLiveCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          setLoading(false);
        }
      }
    } catch (err) {
      console.warn("[ProductsClient] Live sync background fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      syncLiveCatalog();
    }
  }, [syncLiveCatalog, initialProducts]);

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      const searchParam = params.get("search");

      if (catParam) {
        setSelectedCategory(catParam);
        setOpenedCategory(catParam);
        setActiveCategory(catParam);
      }
      if (searchParam) {
        setSearchInput(searchParam);
        setProductSearch(searchParam);
      }
    }
  }, []);

  // Debounce search term updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setProductSearch(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Combined product filtering & grouping
  const { filteredProducts, sortedGroupedProducts, categoryCounts } = useMemo(() => {
    const query = productSearch.trim().toLowerCase();

    const filtered = query
      ? products.filter((item) => {
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
      : products;

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

    return {
      filteredProducts: filtered,
      sortedGroupedProducts: sortedObj,
      categoryCounts: counts,
    };
  }, [products, productSearch]);

  // Final displayed products based on selectedCategory and selectedSubCategory
  const displayedGroupedProducts = useMemo(() => {
    let result = { ...sortedGroupedProducts };

    if (selectedCategory && result[selectedCategory]) {
      result = { [selectedCategory]: result[selectedCategory] };
    }

    if (selectedSubCategory) {
      const filteredBySub = {};
      for (const [cat, subObj] of Object.entries(result)) {
        if (subObj[selectedSubCategory]) {
          filteredBySub[cat] = { [selectedSubCategory]: subObj[selectedSubCategory] };
        }
      }
      if (Object.keys(filteredBySub).length > 0) {
        result = filteredBySub;
      }
    }

    return result;
  }, [sortedGroupedProducts, selectedCategory, selectedSubCategory]);

  const displayedCount = useMemo(() => {
    let sum = 0;
    Object.values(displayedGroupedProducts).forEach((subObj) => {
      Object.values(subObj).forEach((arr) => {
        sum += (arr || []).length;
      });
    });
    return sum;
  }, [displayedGroupedProducts]);

  const getCategoryProductCount = useCallback(
    (categoryName) => {
      return categoryCounts[categoryName] || 0;
    },
    [categoryCounts]
  );

  const toggleCategory = useCallback((category) => {
    setOpenedCategory((prev) => (prev === category ? "" : category));
  }, []);

  const selectCategory = useCallback((category) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setSelectedCategory((prev) => (prev === category ? "" : category));
    setSelectedSubCategory(""); // Reset subcategory when picking category
  }, []);

  const toggleSubCategory = useCallback((category, subCategory) => {
    const key = `${category}-${subCategory}`;
    setOpenedSubCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const selectSubCategory = useCallback((category, subCategory) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setSelectedCategory(category);
    setSelectedSubCategory((prev) => (prev === subCategory ? "" : subCategory));

    const subKey = `${category}-${subCategory}`;
    setOpenedSubCategories((prev) => ({
      ...prev,
      [subKey]: true,
    }));

    // Scroll to products top smoothly with offset
    const el = document.getElementById("products-content-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToProduct = useCallback(
    (slug, category, subCategory) => {
      if (category) {
        setOpenedCategory(category);
        setActiveCategory(category);
        setSelectedCategory(category);
      }
      if (subCategory) {
        setSelectedSubCategory(subCategory);
        const subKey = `${category}-${subCategory}`;
        setOpenedSubCategories((prev) => ({
          ...prev,
          [subKey]: true,
        }));
      }

      setHighlightedProductId(slug);
      setPendingScroll(slug);
    },
    []
  );

  // Smooth scroll to product card with navbar offset
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
    }, 120);

    return () => clearTimeout(timer);
  }, [pendingScroll]);

  // Remove highlight ring after 3.5 seconds
  useEffect(() => {
    if (!highlightedProductId) return;
    const timer = setTimeout(() => {
      setHighlightedProductId("");
    }, 3500);
    return () => clearTimeout(timer);
  }, [highlightedProductId]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSearchInput("");
    setProductSearch("");
  }, []);

  // Back to top visibility
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

  return (
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
          <span className="hero-badge">Human Biomedicals LLP</span>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="products-hero-title"
          >
            {city
              ? `Medical Laboratory Equipment in ${city}`
              : "Medical Laboratory Equipment Catalog"}
          </motion.h1>

          <p className="products-hero-desc">
            Premium clinical diagnostic instruments, automated biochemistry analyzers, hematology analyzers, test strips, and pathology lab equipment.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        {/* Main Search Bar */}
        <div className="products-search">
          <Search size={22} className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name, model, brand, parameter, instrument..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setProductSearch("");
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Layout */}
        <div className="products-layout">
          {/* Sidebar */}
          <aside className="products-sidebar">
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <span className="flex items-center gap-2">
                  <Layers size={18} className="text-[#b03333]" />
                  Categories
                </span>
                <span className="sidebar-count">
                  {Object.keys(sortedGroupedProducts).length}
                </span>
              </h3>

              {/* Sidebar Search */}
              <div className="sidebar-search">
                <Search size={16} className="sidebar-search-icon" />
                <input
                  type="text"
                  placeholder="Filter categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="sidebar-search-input"
                />
              </div>

              {/* All Products Reset Button */}
              <button
                onClick={clearFilters}
                className={`w-full mt-3 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                  !selectedCategory && !selectedSubCategory && !productSearch
                    ? "bg-[#b03333] text-white border-[#b03333] shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>All Products</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    !selectedCategory && !selectedSubCategory && !productSearch
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {products.length}
                </span>
              </button>
            </div>

            <div className="sidebar-categories pt-2">
              {Object.keys(sortedGroupedProducts)
                .filter((category) =>
                  category
                    .toLowerCase()
                    .includes(categorySearch.toLowerCase())
                )
                .map((category) => {
                  const isOpened = openedCategory === category;
                  const isActive = activeCategory === category;
                  const isCategorySelected = selectedCategory === category;
                  const subcategories = sortedGroupedProducts[category] || {};
                  const count = getCategoryProductCount(category);

                  return (
                    <CategoryItem
                      key={category}
                      category={category}
                      isOpened={isOpened}
                      isActive={isActive}
                      isCategorySelected={isCategorySelected}
                      subcategories={subcategories}
                      categoryProductCount={count}
                      toggleCategory={toggleCategory}
                      selectCategory={selectCategory}
                      toggleSubCategory={toggleSubCategory}
                      selectSubCategory={selectSubCategory}
                      openedSubCategories={openedSubCategories}
                      selectedSubCategory={selectedSubCategory}
                      scrollToProduct={scrollToProduct}
                      highlightedProductId={highlightedProductId}
                    />
                  );
                })}
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="products-content">
            <div id="products-content-top" className="scroll-mt-32" />

            {/* Active Filter Bar */}
            {(selectedCategory || selectedSubCategory || productSearch) && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 to-slate-50 border border-rose-200/70 flex flex-wrap items-center justify-between gap-3 shadow-sm animate-fadeIn">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Filter:
                  </span>

                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#b03333] text-white shadow-xs">
                      {selectedCategory}
                    </span>
                  )}

                  {selectedSubCategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#b03333] border border-rose-300 shadow-xs">
                      › {selectedSubCategory}
                    </span>
                  )}

                  {productSearch && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                      &ldquo;{productSearch}&rdquo;
                    </span>
                  )}

                  <span className="text-xs font-semibold text-slate-600 ml-1">
                    ({displayedCount} {displayedCount === 1 ? "Product" : "Products"})
                  </span>
                </div>

                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-slate-700 hover:text-[#b03333] bg-white border border-slate-300 hover:border-[#b03333] px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <X size={14} />
                  <span>View All Products</span>
                </button>
              </div>
            )}

            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[24px] border border-slate-200 p-8 animate-pulse flex flex-col md:flex-row gap-6"
                  >
                    <div className="w-full md:w-[220px] h-[190px] bg-slate-200 rounded-2xl" />
                    <div className="flex-1 space-y-4">
                      <div className="h-7 bg-slate-200 rounded-xl w-2/3" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="h-14 bg-slate-100 rounded-xl" />
                        <div className="h-14 bg-slate-100 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedCount === 0 ? (
              <div className="no-products py-16 text-center bg-white rounded-3xl border border-slate-200 p-10">
                <div className="no-products-icon text-5xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-slate-800">
                  No Products Found
                </h2>
                <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm">
                  We could not find any products matching your current selection.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#b03333] hover:bg-[#8f1f1f] text-white font-semibold text-sm shadow-md transition-all"
                >
                  View All Products
                </button>
              </div>
            ) : (
              Object.entries(displayedGroupedProducts).map(
                ([category, subcategoriesObj]) => (
                  <section
                    key={category}
                    id={category.replace(/\s+/g, "-").toLowerCase()}
                    className="category-section mb-12 scroll-mt-32"
                  >
                    {/* Category Header */}
                    <div className="category-header pb-3 mb-6 border-b border-slate-200 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {category}
                      </h2>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {Object.values(subcategoriesObj).reduce(
                          (sum, list) => sum + list.length,
                          0
                        )}{" "}
                        Products
                      </span>
                    </div>

                    {/* Subcategories */}
                    <div className="subcategory-wrapper-list space-y-10">
                      {Object.entries(subcategoriesObj).map(
                        ([subCategory, list]) => (
                          <div
                            key={subCategory}
                            id={`sub-${subCategory.replace(/\s+/g, "-").toLowerCase()}`}
                            className="subcategory-block scroll-mt-32"
                          >
                            <div className="subcategory-header mb-4 flex items-center justify-between">
                              <h3 className="text-lg font-bold text-[#b03333] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#b03333]" />
                                {subCategory}
                              </h3>
                              <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                {list.length} {list.length === 1 ? "Product" : "Products"}
                              </span>
                            </div>

                            <div className="product-list space-y-5">
                              {list.map((product, idx) => (
                                <ProductCard
                                  key={
                                    product.uid ||
                                    `${product.id || product.slug || "prod"}-${idx}`
                                  }
                                  product={product}
                                  district={district}
                                  isHighlighted={highlightedProductId === product.slug}
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

      {/* Floating Scroll to Top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-[#b03333] text-white shadow-xl hover:bg-[#8f1f1f] hover:scale-110 active:scale-95 transition-all duration-300"
          title="Scroll to top"
        >
          <ChevronUp size={22} />
        </button>
      )}

      {/* Features Bar */}
      <section className="features-section py-14 bg-slate-50 border-t border-slate-200/70">
        <div className="container-custom">
          <div className="features-grid grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck size={28} className="text-[#b03333]" />,
                title: "Certified Diagnostics",
                desc: "100% genuine clinical grade analyzers",
              },
              {
                icon: <Truck size={28} className="text-[#b03333]" />,
                title: "All-India Delivery",
                desc: "Fast & secure medical courier handling",
              },
              {
                icon: <BadgeCheck size={28} className="text-[#b03333]" />,
                title: "Technical Support",
                desc: "Expert calibration & setup assistance",
              },
              {
                icon: <PackageCheck size={28} className="text-[#b03333]" />,
                title: "Bulk Laboratory Supply",
                desc: "Competitive institutional pricing",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="feature-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
              >
                <div className="feature-icon p-3 rounded-xl bg-rose-50 border border-rose-100 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
