"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSite } from "@/lib/site-context";

type HeaderProps = {
  solid?: boolean;
};

export function Header({ solid }: HeaderProps) {
  const site = useSite();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const forceSolid = solid ?? !isHome;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const needsDark = forceSolid || scrolled || menuOpen;
  const logoSrc = needsDark ? site.logoDark : site.logoLight;

  useEffect(() => {
    const dark = new Image();
    dark.src = site.logoDark;
    const light = new Image();
    light.src = site.logoLight;
  }, [site.logoDark, site.logoLight]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>(".hero-video");
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuOpen) {
      if (!reduceMotion) video.pause();
    } else if (!reduceMotion && !video.ended) {
      void video.play().catch(() => {});
    }
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const headerClass = [
    "site-header",
    forceSolid ? "is-solid" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass} id="siteHeader">
      <nav className="navbar navbar-expand-lg" aria-label="Primary">
        <div className="nav-bar">
          <Link className="brand" href={isHome ? "#top" : "/#top"} onClick={closeMenu}>
            <span className="brand-slot is-ready">
              <img
                className={`brand-logo${isHome && !forceSolid ? " brand-logo--light" : ""}`}
                src={logoSrc}
                alt="Radhe Radhe Madhavam"
                width={1547}
                height={612}
                data-brand=""
                data-logo-light={site.logoLight}
                data-logo-dark={site.logoDark}
              />
              <span className="brand-fallback brand-name" aria-hidden="true">
                {site.name}
              </span>
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="siteNav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="toggler-bar" />
            <span className="toggler-bar" />
            <span className="toggler-bar" />
          </button>
          <div
            className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="siteNav"
          >
            <ul className="navbar-nav ms-auto">
              {site.nav.map((item) => (
                <li
                  key={item.href}
                  className={`nav-item${item.mobileOnly ? " nav-item-mobile-only" : ""}`}
                >
                  <Link className="nav-link" href={item.href} onClick={closeMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="btn btn-nav" href="/contact" onClick={closeMenu}>
              Enquire Now
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
