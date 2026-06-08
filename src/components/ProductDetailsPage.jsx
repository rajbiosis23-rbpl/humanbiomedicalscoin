"use client";

import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import toast, {
    Toaster,
} from "react-hot-toast";

import "./product-details.css";

export default function ProductDetailsPage({
    slug,
}) {

    const [product, setProduct] =
        useState(null);

    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        const fetchProduct =
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

                        const products =
                            snap.data()?.products || [];

                        const found =
                            products.find(
                                (item) =>
                                    item.title
                                        ?.toLowerCase()
                                        .replace(
                                            /[^a-z0-9\s-]/g,
                                            ""
                                        )
                                        .replace(
                                            /\s+/g,
                                            "-"
                                        ) === slug
                            );

                        setProduct(found);

                    }

                } catch (error) {

                    console.log(error);

                }
            };

        fetchProduct();

    }, [slug]);

    const submitEnquiry =
        async () => {

            if (!name.trim()) {

                toast.error(
                    "Please enter your name"
                );

                return;
            }

            if (!email.trim()) {

                toast.error(
                    "Please enter your email"
                );

                return;
            }

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(email)
            ) {

                toast.error(
                    "Please enter a valid email"
                );

                return;
            }

            if (
                !/^\d{10}$/.test(phone)
            ) {

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
                            product.title,

                        name,
                        email,
                        phone,

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
    if (!product) {
        return (
            <main className="product-details-page">
                <div className="container-custom">

                    <div className="product-details-grid">

                        <div className="skeleton skeleton-image"></div>

                        <div>

                            <div className="skeleton skeleton-brand"></div>

                            <div className="skeleton skeleton-title"></div>

                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text short"></div>

                            <div className="skeleton skeleton-spec"></div>
                            <div className="skeleton skeleton-spec"></div>
                            <div className="skeleton skeleton-spec"></div>

                        </div>

                    </div>

                </div>
            </main>
        );
    }
    return (

        <main className="product-details-page">

            <Toaster
                position="top-right"
            />

            <div className="container-custom">

                <div className="product-details-grid">

                    <div>

                        <img
                            src={product.image}
                            alt={product.title}
                            className="product-detail-image"
                        />

                    </div>

                    <div>

                        <span className="product-brand">
                            {product.brand}
                        </span>

                        <h1 className="product-detail-title">
                            {product.title}
                        </h1>

                        <p className="product-detail-desc">
                            {product.details}
                        </p>

                        <div className="product-specs">

                            <div>
                                <strong>
                                    Model:
                                </strong>{" "}
                                {product.model}
                            </div>

                            <div>
                                <strong>
                                    Automation:
                                </strong>{" "}
                                {product.automation}
                            </div>

                            <div>
                                <strong>
                                    Availability:
                                </strong>{" "}
                                {product.availability}
                            </div>

                            <div>
                                <strong>
                                    Usage:
                                </strong>{" "}
                                {product.usage}
                            </div>

                            <div>
                                <strong>
                                    Instrument:
                                </strong>{" "}
                                {product.instrument}
                            </div>

                            <div>
                                <strong>
                                    Throughput:
                                </strong>{" "}
                                {product.throughput}
                            </div>

                        </div>

                        {/* ENQUIRY FORM */}

                        <div className="enquiry-card">

                            <h2 className="enquiry-title">
                                Send Enquiry
                            </h2>

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
                                            e.target.value
                                        )
                                    }
                                    className="enquiry-input"
                                />

                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={phone}
                                    maxLength={10}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
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

                            <button
                                className="send-btn"
                                onClick={
                                    submitEnquiry
                                }
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

        </main>
    );
}