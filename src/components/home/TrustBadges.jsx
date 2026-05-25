import "./trustbadges.css";

export default function TrustBadges() {
  const badges = [
    {
      icon: "✓",
      title: "Certified Quality",
      desc: "Premium biomedical products tested for trusted healthcare use.",
    },
    {
      icon: "🏥",
      title: "Hospital Trusted",
      desc: "Trusted by hospitals, laboratories and healthcare professionals.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Quick and secure delivery support across locations.",
    },
    {
      icon: "🌍",
      title: "Global Standards",
      desc: "Products aligned with international healthcare standards.",
    },
  ];

  return (
    <section className="trust-section">
      <div className="container-custom">
        <div className="trust-header">
          <span className="trust-subtitle">TRUST & QUALITY</span>

          <h2 className="trust-title">
            Why Healthcare Industry Trusts RajBiosis
          </h2>

          <p className="trust-text">
            RajBiosis delivers trusted biomedical products with innovation,
            reliability and healthcare excellence.
          </p>
        </div>

        <div className="trust-grid">
          {badges.map((item, i) => (
            <div key={i} className="trust-card">
              <div className="trust-icon">{item.icon}</div>

              <h3 className="trust-card-title">{item.title}</h3>

              <p className="trust-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
