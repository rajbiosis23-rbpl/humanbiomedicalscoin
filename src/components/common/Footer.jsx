"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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

          const snap =
            await getDoc(
              doc(
                db,
                "websites",
                "humanbiomedicalscoin",
                "pages",
                "contact"
              )
            );

          if (snap.exists()) {

            setContactInfo(
              snap.data()
                ?.contactInfo || []
            );

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

          const q =
            query(
              collection(
                db,
                "websites",
                "humanbiomedicalscoin",
                "districts"
              ),
              where(
                "slug",
                "==",
                district
              )
            );

          const snapshot =
            await getDocs(q);

          if (
            !snapshot.empty
          ) {

            setDistrictData(
              snapshot.docs[0].data()
            );

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
      ? `${districtData.district}, ${districtData.state}, India`
      : null;

  // FIND EMAIL
  const email =
    contactInfo.find(
      (item) =>
        item.label
          ?.toLowerCase()
          ?.includes("email")
    )?.value;

  // FIND PHONE
  const phone =
    contactInfo.find(
      (item) =>
        item.label
          ?.toLowerCase()
          ?.includes("phone")
    )?.value;

  // FIND ADDRESS
  const address =
    contactInfo.find(
      (item) =>
        item.label
          ?.toLowerCase()
          ?.includes("office")
    )?.value;

  return (

    <footer className="footer">

      <div className="container-custom">

        <div className="footer-top">

          {/* LOGO */}
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

          {/* SERVICES */}
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

          {/* CONTACT */}
          <div className="footer-contact">

            <h3 className="footer-title">
              Contact Info
            </h3>

            <p>
              📍 {
                dynamicLocation ||
                address
              }
            </p>

            <p>
              📞 {phone}
            </p>

            <p>
              ✉ {email}
            </p>

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