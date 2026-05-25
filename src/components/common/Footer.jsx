import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="container-custom">

        <div className="footer-top">

          <div>

            <h2 className="footer-logo gradient-text">
              RajBiosis
            </h2>

            <p className="footer-desc">

              RajBiosis provides premium
              biomedical products,
              diagnostics, healthcare
              technologies and laboratory
              solutions trusted by
              hospitals and healthcare
              professionals.

            </p>

          </div>

          <div>

            <h3 className="footer-title">
              Quick Links
            </h3>

            <div className="footer-links">

              <Link href="/">
                Home
              </Link>

              <Link href="/about">
                About
              </Link>

              <Link href="/products">
                Products
              </Link>

              <Link href="/services">
                Services
              </Link>

              <Link href="/contact">
                Contact
              </Link>

            </div>

          </div>

          <div>

            <h3 className="footer-title">
              Services
            </h3>

            <div className="footer-links">

              <Link href="#">
                Biomedical Equipment
              </Link>

              <Link href="#">
                Diagnostics
              </Link>

              <Link href="#">
                Lab Solutions
              </Link>

              <Link href="#">
                Healthcare Support
              </Link>

            </div>

          </div>

          <div className="footer-contact">

            <h3 className="footer-title">
              Contact Info
            </h3>

            <p>📍 Jaipur, Rajasthan</p>
            <p>📞 +91 9876543210</p>
            <p>✉ info@rajbiosis.com</p>

          </div>

        </div>

        <div className="footer-bottom">

          <p className="footer-copy">

            © 2026 RajBiosis.
            All Rights Reserved.

          </p>

          {/* <Link
            href="/contact"
            className="footer-btn"
          >
            Contact Us
          </Link> */}

        </div>

      </div>

    </footer>
  );
}