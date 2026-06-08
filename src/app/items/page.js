"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast, {
  Toaster,
} from "react-hot-toast";

// import {
//   addDoc,
//   collection,
//   serverTimestamp,
// } from "firebase/firestore";
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

  const [products, setProducts] = useState([]);

  const productsPerPage = 25;

  const [page, setPage] =
    useState(1);

  const [selectedProduct,
    setSelectedProduct
  ] = useState(null);

  // ENQUIRY FORM
  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  // const [message, setMessage] =
  //   useState("");

  const [loading, setLoading] =
    useState(false);

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

  // SUBMIT ENQUIRY
  const submitEnquiry = async () => {

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error(
        "Phone number must be exactly 10 digits"
      );
      return;
    }

    try {

      setLoading(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "humanbiomedicalscoin",
          "productQueries"
        ),
        {
          productName:
            selectedProduct?.title,

          city,

          name,
          phone,
          email,

          createdAt:
            serverTimestamp(),
        }
      );

      toast.success(
        "Enquiry Sent Successfully"
      );

      setName("");
      setPhone("");
      setEmail("");

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed To Send Enquiry"
      );

    } finally {

      setLoading(false);

    }
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

            const allProducts =
              snap.data()
                ?.products || [];

            const published =
              allProducts.filter(
                (item) =>
                  item.isPublished
              );

            setProducts(
              published
            );

          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchProducts();

  }, []);
  return (

    <main className="products-page">

      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 999999,
        }}
      />

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
                  src={
                    product.image ||
                    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800"
                  }
                  alt={`${product.title} in ${city}`}
                  className="product-image"
                />

                <div className="product-content">

                  <p className="product-category">
                    {product.brand}
                  </p>

                  <h3 className="product-title">
                    {product.title}
                  </h3>

                  {/* <p className="product-desc">
                    {product.desc}
                  </p> */}

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

        {/* PAGINATION */}
        <div className="pagination">

          {Array.from(
            { length: totalPages },
            (_, i) => (

              <button
                key={i}
                className={`page-btn ${page === i + 1
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

      {/* MODAL */}
      {selectedProduct && (

        <div className="modal-overlay">

          <div className="modal-box">

            {/* CLOSE */}
            <button
              className="close-btn"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ✕
            </button>

            <div className="modal-grid">

              {/* LEFT IMAGE */}
              <div className="modal-left">

                <img
                  src={
                    selectedProduct.image ||
                    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800"
                  }
                  alt={selectedProduct.title}
                  className="modal-image"
                />

              </div>

              {/* RIGHT CONTENT */}
              <div className="modal-right">

                <span className="modal-category">
                  {selectedProduct.brand}
                </span>

                <h2 className="modal-title">
                  {selectedProduct.title}
                </h2>

                <p className="modal-description">
                  {selectedProduct.details}
                </p>

                {/* ENQUIRY CARD */}
                <div className="enquiry-card">

                  <h3 className="enquiry-title">
                    Send Query
                  </h3>

                  <p className="enquiry-subtitle">
                    Fill the form and our team
                    will contact you shortly.
                  </p>

                  <div className="form-grid">

                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          )
                        )
                      }
                      className="enquiry-input"
                      maxLength={50}
                    />




                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phone}
                      maxLength={10}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      className="enquiry-input"
                    />

                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="enquiry-input full"
                  />

                  {/* <textarea
                    placeholder="Write Your Message..."
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    className="enquiry-textarea"
                  /> */}

                  <button
                    className="send-btn"
                    onClick={submitEnquiry}
                    disabled={loading}
                  >

                    {loading
                      ? "Sending..."
                      : "Send Enquiry"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}