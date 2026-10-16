"use client";

import {
  useEffect,
  useState,
  useMemo,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import { fetchContactData, fetchDistrictData } from "@/lib/data-fetcher";

import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import "./footer.css";

export default function Footer() {

  const pathname =
    usePathname();

  const [contactInfo,
    setContactInfo
  ] = useState([]);

  const [districtData,
    setDistrictData
  ] = useState(null);

  const firstSegment =
    pathname.split("/")[1];

  const staticRoutes = [
    "",
    "about",
    "items",
    "services",
    "contact",
  ];

  const district =
    !staticRoutes.includes(
      firstSegment
    )
      ? firstSegment
      : "";

  const basePath =
    district
      ? `/${district}`
      : "";

  // CONTACT INFO
  useEffect(() => {

    const fetchContact =
      async () => {

        try {
          const data = await fetchContactData();
          if (Array.isArray(data)) {
            setContactInfo(data);
          } else if (data?.contactInfo) {
            setContactInfo(data.contactInfo);
          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchContact();

  }, []);

  // DISTRICT
  useEffect(() => {

    const fetchDistrict =
      async () => {

        if (!district)
          return;

        try {
          const data = await fetchDistrictData(district);
          if (data) {
            setDistrictData(data);
          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchDistrict();

  }, [district]);

  const dynamicLocation =
    district &&
      districtData &&
      district.toLowerCase() !== "jaipur"
      ? `${districtData.district || districtData.name || ""}, ${districtData.state || ""}, India`
      : null;

  // Extract all dynamic phone numbers from admin contactInfo (supports multiple)
  const phoneNumbers = useMemo(() => {
    const list = [];
    contactInfo.forEach((item) => {
      const label = (item.label || "").toLowerCase();
      if (
        label.includes("phone") ||
        label.includes("mobile") ||
        label.includes("contact") ||
        label.includes("call") ||
        label.includes("tel") ||
        label.includes("whatsapp")
      ) {
        if (item.value) {
          String(item.value)
            .split(/[,/|\n]/)
            .map((p) => p.trim())
            .filter(Boolean)
            .forEach((p) => {
              if (!list.includes(p)) list.push(p);
            });
        }
      }
    });
    return list;
  }, [contactInfo]);

  // Extract all dynamic emails from admin contactInfo (supports multiple)
  const emails = useMemo(() => {
    const list = [];
    contactInfo.forEach((item) => {
      const label = (item.label || "").toLowerCase();
      if (label.includes("email") || label.includes("mail")) {
        if (item.value) {
          String(item.value)
            .split(/[,/|\n]/)
            .map((e) => e.trim())
            .filter(Boolean)
            .forEach((e) => {
              if (!list.includes(e)) list.push(e);
            });
        }
      }
    });
    return list;
  }, [contactInfo]);

  // FIND ADDRESS
  const address =
    contactInfo.find(
      (item) =>
        item.label
          ?.toLowerCase()
          ?.includes("office") ||
        item.label
          ?.toLowerCase()
          ?.includes("address")
    )?.value;

  const displayAddress = dynamicLocation || address || "";

  // Dynamic WhatsApp number from admin phone
  const whatsappDigits = useMemo(() => {
    const waItem = contactInfo.find((item) =>
      (item.label || "").toLowerCase().includes("whatsapp")
    );
    const sourcePhone = waItem?.value || phoneNumbers[0] || "";
    const phoneStr = Array.isArray(sourcePhone) ? sourcePhone[0] : sourcePhone;
    return String(phoneStr || "").replace(/\D/g, "");
  }, [contactInfo, phoneNumbers]);

  return (

    <footer className="footer">

      <div className="container-custom">

        <div className="footer-top">

          {/* LOGO & SOCIALS */}
          <div>

            <h2 className="footer-logo gradient-text">
              Human Biomedicals
            </h2>

            <p className="footer-desc">

              Human Biomedicals provides premium
              biomedical products,
              diagnostics, healthcare
              technologies and laboratory
              solutions trusted by
              hospitals and healthcare
              professionals.

            </p>

            <div className="footer-socials">

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              {whatsappDigits ? (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              ) : null}

            </div>

          </div>

          {/* LINKS */}
          <div>

            <h3 className="footer-title">
              Quick Links
            </h3>

            <div className="footer-links">

              <Link href={basePath || "/"}>
                Home
              </Link>

              <Link href={`${basePath}/about`}>
                About
              </Link>

              <Link href={`${basePath}/items`}>
                Products
              </Link>

              <Link href={`${basePath}/services`}>
                Services
              </Link>

              <Link href={`${basePath}/contact`}>
                Contact
              </Link>

            </div>

          </div>

          {/* CATEGORIES / SERVICES */}
          <div>

            <h3 className="footer-title">
              Categories
            </h3>

            <div className="footer-links">

              <Link href={`${basePath}/items?category=Biochemistry`}>
                Biochemistry Analyzers
              </Link>

              <Link href={`${basePath}/items?category=CLIA`}>
                CLIA & Immunoassay
              </Link>

              <Link href={`${basePath}/items?category=Hematology`}>
                Hematology Analyzers
              </Link>

              <Link href={`${basePath}/items?category=Electrolyte`}>
                Electrolyte & Urine
              </Link>

              <Link href={`${basePath}/items?category=Rapid`}>
                Rapid Diagnostic Kits
              </Link>

            </div>

          </div>

          {/* CONTACT */}
          <div className="footer-contact">

            <h3 className="footer-title">
              Contact Info
            </h3>

            {displayAddress && (
              <p>
                📍 {displayAddress}
              </p>
            )}

            {phoneNumbers.map((phone, idx) => (
              <p key={`phone-${idx}`}>
                📞 <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
              </p>
            ))}

            {emails.map((email, idx) => (
              <p key={`email-${idx}`}>
                ✉️ <a href={`mailto:${email}`}>{email}</a>
              </p>
            ))}

          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">

          <p className="footer-copy">

            © 2026 Human Biomedicals.
            All Rights Reserved.

          </p>

        </div>

      </div>

    </footer>
  );
}