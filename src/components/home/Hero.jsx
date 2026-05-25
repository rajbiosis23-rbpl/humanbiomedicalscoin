"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import "./home.css";
import imageone from "@/components/home/img-1.png"

export default function Hero({
  city = "",
}) {

  return (
    <section className="hero-section">

      <div className="container-custom">

      <div className="hero-grid">
  <motion.div
    initial={{
      opacity: 0,
      x: -80
    }}
    animate={{
      opacity: 1,
      x: 0
    }}
    transition={{
      duration: 0.8
    }}
  >
    <span className="hero-badge">
      {city
        ? `Trusted Biomedical Products in ${city}`
        : "Trusted Biomedical Products Across India"}
    </span>

    <h1 className="hero-title">
  RajBiosis

  <span className="gradient-text">
    {" "}
    Biomedical,
    Diagnostic &
    Laboratory
    Equipment
  </span>

  <br />

  {city ? (
    <>
      in {city}
      <br />
    </>
  ) : (
    <>
      Across India
      <br />
    </>
  )}

  {/* For Hospitals,
  Pathology Labs &
  Healthcare */}
</h1>

<p className="hero-description">
  {city ? (
    <>
      RajBiosis is a trusted supplier of
      <strong>
        {" "}biomedical products in {city}
      </strong>,
      diagnostic machines, pathology lab
      equipment, CBC machines, Elisa
      readers, hospital equipment,
      laboratory instruments and medical
      devices for hospitals, clinics and
      healthcare professionals.
    </>
  ) : (
    <>
      RajBiosis provides premium
      biomedical products, pathology lab
      equipment, diagnostic machines,
      CBC analyzers, hospital equipment,
      laboratory instruments and
      healthcare solutions across India
      for hospitals, laboratories and
      medical professionals.
    </>
  )}
</p>

    <div className="hero-btns">
      <Link
        href="/items"
        className="hero-primary-btn"
      >
        Explore Products
      </Link>

      <Link
        href="/contact"
        className="hero-secondary-btn"
      >
        Get Quote
      </Link>
    </div>
  </motion.div>

  <motion.div
    initial={{
      opacity: 0,
      scale: 0.8
    }}
    animate={{
      opacity: 1,
      scale: 1
    }}
    transition={{
      duration: 0.8
    }}
  >
    <div className="hero-image-card">
      <Image
        src={imageone}
        alt={`RajBiosis Biomedical Products ${city ? `in ${city}` : "Across India"}`}
        width={700}
        height={700}
        className="hero-image"
        priority
      />
    </div>
  </motion.div>
</div>

        {/* DESCRIPTION NICHE */}
        {/* <p className="hero-description-full">
          RajBiosis provides premium biomedical products,
          laboratory solutions, diagnostics, healthcare
          equipment and medical technologies in{" "}
          <strong>{city}</strong> trusted by hospitals,
          laboratories and healthcare professionals.
        </p> */}

      </div>
    </section>
  );
}