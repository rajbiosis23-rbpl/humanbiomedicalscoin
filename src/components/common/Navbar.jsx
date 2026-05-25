"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./navbar.css";
import logo from "@/public/images/logo.png";

export default function Navbar() {
  const pathname =
    usePathname();

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

  const navLinks = [
    {
      name: "Home",
      path:
        `${basePath}`,
    },
    {
      name: "About",
      path:
        `${basePath}/about`,
    },
    {
      name: "Products",
      path:
        `${basePath}/items`,
    },
    {
      name: "Services",
      path:
        `${basePath}/services`,
    },
    {
      name: "Contact",
      path:
        `${basePath}/contact`,
    },
  ];

  return (
    <header className="navbar">
      <nav className="container-custom navbar-container">

        <Link
          href={
            basePath || "/"
          }
          className="navbar-logo"
        >
          <Image
            src={logo}
            alt="RajBiosis Logo"
            priority
            className="logo-image"
          />
        </Link>

        <div className="nav-links">
          {navLinks.map(
            (link) => (
              <Link
                key={link.path}
                href={link.path}
                className="nav-link"
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        <Link
          href={`${basePath}/contact`}
          className="nav-btn"
        >
          Contact Us
        </Link>

        <div className="mobile-menu">
          ☰
        </div>

      </nav>
    </header>
  );
}