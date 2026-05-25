

import Image from "next/image";
import "../about/about.css";
import aboutimage from "@/app/about/image-2.png";


export default function AboutPage({
  city = "",
}) {

  const cards = [
    {
      title: "Our Mission",
      description:
        "To provide trusted biomedical products and healthcare technologies that improve patient care, diagnostics and medical excellence globally."
    },
    {
      title: "Our Vision",
      description:
        "To become a globally trusted biomedical solutions provider by delivering innovation, reliability and quality healthcare products."
    },
    {
      title: "Why Choose Us",
      description: city
        ? `Global Biomedical delivers premium biomedical products and healthcare solutions in ${city} for hospitals and laboratories.`
        : "Global Biomedical delivers premium biomedical products and healthcare solutions for hospitals and laboratories across India."
    }
  ];

  return (
    <main>

      <section className="about-hero">

        <div className="container-custom">

          <div className="about-grid">

            <div>

              <span className="section-subtitle">
                ABOUT GLOBAL BIOMEDICAL
              </span>

              <h1 className="about-title mt-6">

                Trusted Biomedical
                Solutions{" "}

                {city ? (
                  <>
                    in{" "}
                    <span
                      style={{
                        color: "#198754"
                      }}
                    >
                      {city}
                    </span>
                  </>
                ) : (
                  <>
                    Across{" "}
                    <span
                      style={{
                        color: "#198754"
                      }}
                    >
                      India
                    </span>
                  </>
                )}

                <br />

                For Modern
                Healthcare

              </h1>

              <p className="about-desc">

                Global Biomedical
                is a trusted biomedical
                products company
                delivering innovative
                medical technologies,
                diagnostics,
                laboratory solutions
                and healthcare
                equipment{" "}

                {city ? (
                  <>
                    in <strong>{city}</strong>
                  </>
                ) : (
                  <>
                    across <strong>India</strong>
                  </>
                )}

                {" "}for hospitals,
                laboratories and
                healthcare
                professionals.

              </p>

            </div>

            <div className="about-image-card">

              <Image
                src={aboutimage}
                alt={
                  city
                    ? `About Global Biomedical in ${city}`
                    : "About Global Biomedical Across India"
                }
                width={700}
                height={700}
                className="about-image"
              />

            </div>

          </div>

        </div>

      </section>

      <section className="about-section">

        <div className="container-custom">

          <div className="text-center">

            <span className="section-subtitle">
              WHY GLOBAL BIOMEDICAL
            </span>

            <h2 className="section-title mt-4">

              Innovation Meets
              Healthcare
              Excellence{" "}

              {city
                ? `in ${city}`
                : "Across India"}

            </h2>

          </div>

          <div className="about-cards">

            {cards.map(
              (item, index) => (
                <div
                  key={index}
                  className="about-card"
                >
                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>
                </div>
              )
            )}

          </div>

          <div className="about-stats">

            <div className="about-stats-grid">

              <div className="about-stat">
                <h2>15+</h2>
                <p>Years Experience</p>
              </div>

              <div className="about-stat">
                <h2>500+</h2>
                <p>Products</p>
              </div>

              <div className="about-stat">
                <h2>50K+</h2>
                <p>Happy Clients</p>
              </div>

              <div className="about-stat">
                <h2>99%</h2>
                <p>Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}