"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] =
    useState(false);

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

  const basePath = district
    ? `/${district}`
    : "";

  const navLinks = [
    {
      name: "Home",
      path: `${basePath}/`,
    },
    {
      name: "About",
      path: `${basePath}/about`,
    },
    {
      name: "Products",
      path: `${basePath}/items`,
    },
    {
      name: "Services",
      path: `${basePath}/services`,
    },
    {
      name: "Contact",
      path: `${basePath}/contact`,
    },
  ];

  return (
    <header className="navbar">
      <nav className="container-custom navbar-container">
        <Link
          href={basePath || "/"}
          className="navbar-logo"
        >
          <Image
            src="/humanlogo.png"
            alt="Human Biomedical Logo"
            width={180}
            height={60}
            priority
            className="logo-image"
          />
        </Link>

        <div
          className={`nav-links ${menuOpen ? "active" : ""
            }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="nav-link"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Link
          href={`${basePath}/contact`}
          className="nav-btn"
        >
          Contact Us
        </Link>

        <button
          className="mobile-menu"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>
    </header>
  );
}