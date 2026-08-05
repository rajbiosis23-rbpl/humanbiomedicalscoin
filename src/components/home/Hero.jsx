"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import imageone from "@/components/home/img-1.png";

import "./home.css";

export default function Hero({ city = "" }) {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalscoin",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchHero();
  }, []);

  const data = {
    badge: heroData?.badge || "ISO 9001:2015 Certified Biomedical Supplier",
    title: heroData?.title || "Advanced Biomedical & Laboratory Equipment",
    description: heroData?.description || "Human Biomedicals provides top-tier pathology analyzers, biochemistry systems, hematology instruments, and 24/7 technical support for hospitals & diagnostic centers across India.",
    button1Text: heroData?.button1Text || "Get Quote",
    button1Link: heroData?.button1Link || "/contact",
    button2Text: heroData?.button2Text || "View Products",
    button2Link: heroData?.button2Link || "/items",
  };

  return (
    <section className="hero-section">
      <div className="container-custom">
        <div className="hero-grid">

          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              x: -80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <span className="section-subtitle">
              Huamn Biomedical IN {(city || "India").toUpperCase()}
            </span>
            {data.badge && (
              <span className="hero-badge">
                {data.badge}
              </span>
            )}

            {data.title && (
              <h1 className="hero-title">
                {data.title}
              </h1>
            )}

            {data.description && (
              <p className="hero-description">
                {data.description}
              </p>
            )}

            <div className="hero-btns">
              <Link
                href={city ? `/${city.toLowerCase()}/contact/` : "/contact"}
                className="hero-primary-btn"
              >
                Get Quote
              </Link>

              <Link
                href={city ? `/${city.toLowerCase()}/items/` : "/items"}
                className="hero-secondary-btn"
              >
                View Products
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <div className="hero-image-card">
              {heroData?.imageUrl ? (
                <img
                  src={heroData.imageUrl}
                  alt="Hero Image"
                  className="hero-image"
                />
              ) : (
                <Image
                  src={imageone}
                  alt="Hero Image"
                  width={700}
                  height={700}
                  className="hero-image"
                  priority
                />
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}