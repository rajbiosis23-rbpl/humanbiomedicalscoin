"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchHomeData } from "@/lib/data-fetcher";
import imageone from "@/components/home/img-1.png";

import "./home.css";

export default function Hero({ city = "" }) {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await fetchHomeData();
        if (data) {
          setHeroData(data);
        }
      } catch (error) {
        console.log("Error loading hero data:", error);
      }
    };

    fetchHero();
  }, []);

  const badge = heroData?.badge || "";
  const title = heroData?.title || "";
  const description = heroData?.description || "";
  const button1Text = heroData?.button1Text || "";
  const button2Text = heroData?.button2Text || "";

  // Static links as specified
  const button1Link = city ? `/${city.toLowerCase()}/contact/` : "/contact";
  const button2Link = city ? `/${city.toLowerCase()}/items/` : "/items";

  const heroImageUrl = heroData?.imageUrl || heroData?.image || "";

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
              Human Biomedical IN {(city || "India").toUpperCase()}
            </span>

            {badge && (
              <span className="hero-badge">
                {badge}
              </span>
            )}

            {title && (
              <h1 className="hero-title">
                {title}
              </h1>
            )}

            {description && (
              <p className="hero-description">
                {description}
              </p>
            )}

            {(button1Text || button2Text) && (
              <div className="hero-btns">
                {button1Text && (
                  <Link
                    href={button1Link}
                    className="hero-primary-btn"
                  >
                    {button1Text}
                  </Link>
                )}

                {button2Text && (
                  <Link
                    href={button2Link}
                    className="hero-secondary-btn"
                  >
                    {button2Text}
                  </Link>
                )}
              </div>
            )}
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
              {heroImageUrl ? (
                <img
                  src={heroImageUrl}
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