import "./whychoose.css";

export default function WhyChoose() {

  const features = [
    {
      number: "01",
      title: "Premium Biomedical Quality",
      desc:
        "Trusted biomedical products engineered for hospitals, laboratories and healthcare environments.",
    },
    {
      number: "02",
      title: "Advanced Laboratory Equipment",
      desc:
        "Modern diagnostic and laboratory solutions with precision and reliability.",
    },
    {
      number: "03",
      title: "Trusted Healthcare Partner",
      desc:
        "Healthcare providers trust Human Biomedicals for quality, consistency and innovation.",
    },
    {
      number: "04",
      title: "Fast Delivery Support",
      desc:
        "Efficient supply chain ensuring fast product availability and delivery.",
    },
    {
      number: "05",
      title: "Human Biomedicals Quality Standards",
      desc:
        "Products aligned with international biomedical and healthcare standards.",
    },
    {
      number: "06",
      title: "24/7 Customer Assistance",
      desc:
        "Dedicated customer support for hospitals, clinics and healthcare professionals.",
    },
  ];

  return (
    <section className="why-section">

      <div className="container-custom">

        <div className="why-header">
          <span className="why-subtitle">
            WHY Human Biomedicals
          </span>

          <h2 className="why-title">
            Why Healthcare Professionals
            Choose Human Biomedicals
          </h2>

          <p className="why-text">
            Delivering trusted biomedical
            products and innovative
            healthcare solutions with
            reliability and excellence.
          </p>

        </div>

        <div className="why-grid">

          {features.map((item, i) => (

            <div
              key={i}
              className="why-card"
            >

              <div className="why-card-top">

                <span className="why-number">
                  {item.number}
                </span>

                <div className="why-icon" />

              </div>

              <h3 className="why-card-title">
                {item.title}
              </h3>

              <p className="why-card-desc">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}