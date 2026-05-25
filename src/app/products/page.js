"use client";
import { useState } from "react";
import Link from "next/link";
import "./product.css";

export default function ProductsPage({
  city = "India",
}) {

  const products = Array.from(
    { length: 100 },
    (_, i) => ({
      id: i + 1,
      slug: `biomedical-product-${i + 1}`,
      name: `Biomedical Product ${i + 1}`,
      category: "Healthcare",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800",
      short:
        `Advanced biomedical equipment for hospitals and laboratories in ${city}.`,
      details:
        `Premium biomedical product for hospitals, pathology labs and healthcare professionals in ${city}.`
    })
  );

  const productsPerPage = 25;

  const [page, setPage] =
    useState(1);

  const [selectedProduct,
    setSelectedProduct
  ] = useState(null);

  const start =
    (page - 1) *
    productsPerPage;

  const currentProducts =
    products.slice(
      start,
      start +
      productsPerPage
    );

  const totalPages =
    Math.ceil(
      products.length /
      productsPerPage
    );

  return (
    <main className="products-page">

      <div className="container-custom">

        <div className="products-header">

          <span className="section-subtitle">
            OUR PRODUCTS IN {city.toUpperCase()}
          </span>

          <h1 className="products-title mt-4">

            Biomedical Products
            in {city}

          </h1>

          <p className="products-desc">

            Explore advanced
            biomedical solutions
            trusted by hospitals
            and laboratories in{" "}
            <strong>{city}</strong>

          </p>

        </div>

        <div className="products-grid">

          {currentProducts.map(
            (product) => (

            <div
              key={product.id}
              className="product-card"
            >

              <img
                src={product.image}
                alt={`${product.name} in ${city}`}
                className="product-image"
              />

              <div className="product-content">

                <p className="product-category">
                  {product.category}
                </p>

                <h3 className="product-title">
                  {product.name}
                </h3>

                <p className="product-desc">
                  {product.short}
                </p>

               <button
                className="view-btn"
                onClick={() =>
                  setSelectedProduct(product)
                }
              >
                View Details
              </button>

              </div>

            </div>
          ))}

        </div>

        <div className="pagination">

          {Array.from(
            { length: totalPages },
            (_, i) => (

            <button
              key={i}
              className={`page-btn ${
                page === i + 1
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setPage(i + 1)
              }
            >
              {i + 1}
            </button>
          ))}

        </div>

      </div>

      {selectedProduct && (

        <div className="modal-overlay">

          <div className="modal-box">

            <div className="modal-grid">

              <img
                src={
                  selectedProduct.image
                }
                alt={
                  selectedProduct.name
                }
                className="modal-image"
              />

              <div className="modal-content">

                <button
                  className="close-btn"
                  onClick={() =>
                    setSelectedProduct(
                      null
                    )
                  }
                >
                  X
                </button>

                <h2 className="text-5xl font-bold mt-10">
                  {
                    selectedProduct.name
                  }
                </h2>

                <p className="text-[#9b111e] mt-4 text-xl">
                  {
                    selectedProduct.category
                  }
                </p>

                <p className="text-[#666] mt-8 text-lg leading-9">
                  {
                    selectedProduct.details
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}