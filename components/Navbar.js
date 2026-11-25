"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <Link href="/" className="logo" onClick={closeMenu}>
        <Image
          src="/logo.png"
          alt="Wealth Bloomers Logo"
          width={180}
          height={60}
          className="logo-img"
          priority
        />
      </Link>

      <button
        type="button"
        className={`nav-toggle ${isOpen ? "nav-toggle--open" : ""}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <span className="nav-toggle__line" aria-hidden="true" />
        <span className="nav-toggle__line" aria-hidden="true" />
        <span className="nav-toggle__line" aria-hidden="true" />
      </button>

      <nav
        id="primary-navigation"
        className={`nav-menu ${isOpen ? "nav-menu--open" : ""}`}
        aria-label="Main navigation"
      >
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={isActive ? "nav-link--active" : ""}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
