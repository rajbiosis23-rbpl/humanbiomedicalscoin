import "./testimonials.css";

export default function Testimonials() {

  const testimonials = [
    {
      name: "Dr. Sharma",
      role: "Senior Pathologist",
      text:
        "RajBiosis has consistently delivered premium biomedical products with outstanding quality and timely support.",
    },
    {
      name: "Amit Verma",
      role: "Hospital Procurement Manager",
      text:
        "Their healthcare solutions and laboratory equipment have improved our workflow significantly.",
    },
    {
      name: "Dr. Mehta",
      role: "Diagnostic Specialist",
      text:
        "Highly reliable biomedical partner with trusted products and professional customer support.",
    },
  ];

  return (
    <section className="testimonial-section">

      <div className="container-custom">

        <div className="testimonial-header">

          <span className="testimonial-subtitle">
            CLIENT TESTIMONIALS
          </span>

          <h2 className="testimonial-title">
            Trusted By Healthcare
            Professionals
          </h2>

          <p className="testimonial-text">

            Hospitals, laboratories and
            healthcare professionals trust
            RajBiosis for quality biomedical
            products and excellent support.

          </p>

        </div>

        <div className="testimonial-grid">

          {testimonials.map(
            (item, i) => (

            <div
              key={i}
              className="testimonial-card"
            >

              <div className="stars">
                ★★★★★
              </div>

              <p className="testimonial-desc">

                {item.text}

              </p>

              <div className="testimonial-user">

                <div className="testimonial-avatar" />

                <div>

                  <h4 className="testimonial-name">
                    {item.name}
                  </h4>

                  <p className="testimonial-role">
                    {item.role}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}