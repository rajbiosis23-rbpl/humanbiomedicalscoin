import "./contact.css";

export default function ContactPage({
  city = "",
}) {

  const formattedCity =
    city
      ? city
          .replace(/-/g, " ")
          .replace(
            /\b\w/g,
            (char) =>
              char.toUpperCase()
          )
      : "India";

  return (
    <main>

      <section className="contact-hero">

        <div className="container-custom">

          <div className="contact-grid">

            <div>

              <span className="section-subtitle">
                CONTACT RAJBIOSIS
              </span>

              <h1 className="contact-title mt-6">

                Let’s Connect
                With RajBiosis

                {city && (
                  <>
                    <br />
                    in {formattedCity}
                  </>
                )}

              </h1>

              <p className="contact-desc">

                Have questions about our
                biomedical products,
                healthcare technologies or
                laboratory solutions

                {city && (
                  <>
                    {" "}in{" "}
                    <strong>
                      {formattedCity}
                    </strong>
                  </>
                )}?

                Get in touch with our expert
                team today.

              </p>

            </div>

            <div className="contact-form-card">

              <form className="contact-form">

                <input
                  type="text"
                  placeholder="Full Name"
                  className="contact-input"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="contact-input"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  className="contact-input"
                />

                <textarea
                  placeholder="Write Your Message"
                  className="contact-textarea"
                />

                <button
                  type="submit"
                  className="contact-btn"
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

      {/* CONTACT INFO */}
      <section className="contact-info">

        <div className="container-custom">

          <div className="text-center mb-20">

            <span className="section-subtitle">
              CONTACT DETAILS
            </span>

            <h2 className="section-title mt-4">

              Get In Touch
              With Us

            </h2>

          </div>

          <div className="contact-info-grid">

            <div className="contact-card">

              <h3>
                Office Address
              </h3>

              <p>
                {formattedCity},
                India
              </p>

            </div>

            <div className="contact-card">

              <h3>
                Email Address
              </h3>

              <p>
                info@rajbiosis.com
              </p>

            </div>

            <div className="contact-card">

              <h3>
                Phone Number
              </h3>

              <p>
                +91 9876543210
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* MAP */}
      <section className="map-section">

        <div className="container-custom">

          <div className="map-box">

            <iframe
              src={`https://maps.google.com/maps?q=${formattedCity}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />

          </div>
        </div>
      </section>
    </main>
  );
}