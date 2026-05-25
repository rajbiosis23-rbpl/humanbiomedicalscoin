import Link from "next/link";
import "./services.css";

export default function ServicesPage() {

  const services = [
    {
      title: "Biomedical Equipment",
      desc:
        "Premium biomedical products and medical equipment for hospitals, laboratories and healthcare facilities."
    },
    {
      title: "Diagnostic Solutions",
      desc:
        "Advanced diagnostics tools and technologies for accurate medical testing and healthcare excellence."
    },
    {
      title: "Laboratory Solutions",
      desc:
        "Innovative laboratory equipment and biomedical support systems for modern research."
    },
    {
      title: "Healthcare Consultation",
      desc:
        "Professional consultation for selecting the right biomedical products and healthcare technologies."
    },
    {
      title: "Installation Support",
      desc:
        "Complete setup, implementation and operational support for biomedical systems."
    },
    {
      title: "Maintenance Service",
      desc:
        "Reliable maintenance and technical support to ensure smooth medical operations."
    },
  ];

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

  return (
    <main>

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

            RajBiosis provides advanced
            biomedical services, laboratory
            support, diagnostics solutions
            and healthcare technologies
            trusted by hospitals and
            healthcare professionals.

          </p>

        </div>

      </section>

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

            {services.map((item, index) => (
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

            {process.map((item, index) => (
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