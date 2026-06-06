"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import "./services.css";

export default function ServicesPage() {

  const [services, setServices] =
    useState([]);

  const process = [
    {
      title: "Consultation",
      desc:
        "Understand healthcare requirements."
    },
    {
      title: "Product Selection",
      desc:
        "Choose the right biomedical solution."
    },
    {
      title: "Implementation",
      desc:
        "Setup and installation process."
    },
    {
      title: "Support",
      desc:
        "Continuous maintenance assistance."
    }
  ];

  useEffect(() => {

    const fetchServices =
      async () => {

        try {

          const snap =
            await getDoc(
              doc(
                db,
                "websites",
                "humanbiomedicalscoin",
                "pages",
                "services"
              )
            );

          if (snap.exists()) {

            setServices(
              snap.data()
                ?.services || []
            );

          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchServices();

  }, []);

  return (

    <main>

      {/* HERO */}
      <section className="services-hero">

        <div className="container-custom">

          <span className="section-subtitle">
            OUR SERVICES
          </span>

          <h1 className="services-title mt-5">

            Trusted Biomedical
            Services For Healthcare
            Excellence

          </h1>

          <p className="services-desc">

            Human Biomedicals provides advanced
            biomedical services, laboratory
            support, diagnostics solutions
            and healthcare technologies
            trusted by hospitals and
            healthcare professionals.

          </p>

        </div>

      </section>

      {/* SERVICES */}
      <section className="services-section">

        <div className="container-custom">

          <div className="text-center">

            <span className="section-subtitle">
              WHAT WE OFFER
            </span>

            <h2 className="section-title mt-4">

              Our Premium
              Services

            </h2>

          </div>

          <div className="services-grid">

            {services.map(
              (item, index) => (

                <div
                  key={index}
                  className="service-card"
                >

                  <div className="service-icon" />

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.desc}
                  </p>

                </div>
              ))}

          </div>

        </div>

      </section>

      {/* PROCESS */}
      <section className="process-section">

        <div className="container-custom">

          <div className="text-center">

            <span className="section-subtitle">
              OUR PROCESS
            </span>

            <h2 className="section-title mt-4">

              How We Work

            </h2>

          </div>

          <div className="process-grid">

            {process.map(
              (item, index) => (

                <div
                  key={index}
                  className="process-card"
                >

                  <div className="process-number">

                    0{index + 1}

                  </div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.desc}
                  </p>

                </div>
              ))}

          </div>

        </div>

      </section>

    </main>
  );
}