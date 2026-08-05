"use client";

import React from "react";
import Link from "next/link";
import { FaTruck, FaTools, FaShieldAlt, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import "./home-banner.css";

export default function HomeBanner({ city = "" }) {
  const currentCity = city || "India";

  return (
    <section className="home-banner-section">
      <div className="container-custom">
        <div className="home-banner-card">
          <div className="home-banner-grid">

            {/* Left Content */}
            <div className="banner-left">

              <div className="banner-badge">
                <span className="badge-dot"></span>
                <span>Leading Biomedical & Diagnostic Supplier in {currentCity}</span>
              </div>

              <h2 className="banner-title">
                Elevate Your Laboratory with <br />
                <span className="highlight-gold">Next-Gen Diagnostic Solutions</span>
              </h2>

              <p className="banner-desc">
                Human Biomedicals delivers premium Maglumi CLIA analyzers, fully automated biochemistry systems, 5-part hematology counters, and ELISA readers with guaranteed 24/7 technical AMC support.
              </p>

              {/* 3 Pillars */}
              <div className="banner-features-grid">
                <div className="feature-pill">
                  <FaTruck className="feature-icon" />
                  <div className="feature-text">
                    <h4>Pan-India Express</h4>
                    <p>Safe delivery across districts</p>
                  </div>
                </div>

                <div className="feature-pill">
                  <FaTools className="feature-icon" />
                  <div className="feature-text">
                    <h4>2-Hour Response</h4>
                    <p>Certified engineer AMC support</p>
                  </div>
                </div>

                <div className="feature-pill">
                  <FaShieldAlt className="feature-icon" />
                  <div className="feature-text">
                    <h4>100% Genuine</h4>
                    <p>With full warranty & training</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="banner-actions">
                <Link
                  href={city ? `/${city.toLowerCase()}/items/` : "/items"}
                  className="btn-primary-gold"
                >
                  <span>Browse Equipment Catalog</span>
                  <span>→</span>
                </Link>

                <Link
                  href={city ? `/${city.toLowerCase()}/contact/` : "/contact"}
                  className="btn-outline-white"
                >
                  <FaPhoneAlt style={{ fontSize: "12px" }} />
                  <span>Contact Specialist</span>
                </Link>
              </div>

            </div>

            {/* Right Showcase Box */}
            <div className="banner-right">
              <div className="banner-highlight-box">

                <div className="box-header">
                  <span className="box-tag">Featured Equipment</span>
                  <span className="box-status">
                    <FaCheckCircle style={{ display: "inline", marginRight: "4px" }} />
                    In Stock
                  </span>
                </div>

                <h3 className="box-title">Maglumi CLIA Analyzers</h3>
                <p className="box-desc">
                  High-speed chemiluminescence immunoassay testing systems for thyroid, fertility, cardiac markers, and infectious diseases.
                </p>

                <div className="specs-list">
                  <div className="spec-item">
                    <span className="spec-label">Throughput</span>
                    <span className="spec-val">Up to 180 tests/hr</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Reagent Storage</span>
                    <span className="spec-val">Onboard Refrigeration</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Installation</span>
                    <span className="spec-val">Free On-site Setup</span>
                  </div>
                </div>

                <Link
                  href={city ? `/${city.toLowerCase()}/contact/` : "/contact"}
                  className="btn-full-quote"
                >
                  Request Price Quote
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
