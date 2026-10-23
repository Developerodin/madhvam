import Link from "next/link";
import type { PublicSiteSettings } from "@/lib/content/getters";

type FooterProps = {
  topHref?: string;
  site: PublicSiteSettings;
};

export function Footer({ topHref = "#top", site }: FooterProps) {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="footer-logo" href="/#top">
            <picture>
              <img
                src={site.logoLight}
                alt="Radhe Radhe Madhavam"
                width={1547}
                height={612}
              />
            </picture>
          </Link>
        </div>

        <div className="footer-vrule" aria-hidden="true" />

        <div className="footer-contacts">
          <h2 className="footer-contact-title">Contact Information</h2>
          <div className="footer-contact">
            <span className="footer-ico" aria-hidden="true">
              <span className="gallery-ico gallery-ico-map-pin" />
            </span>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Corporate Office</span>
              <span className="footer-contact-value">{site.corporateAddress}</span>
            </div>
          </div>
          <div className="footer-contact">
            <span className="footer-ico" aria-hidden="true">
              <span className="gallery-ico gallery-ico-buildings" />
            </span>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Site Address</span>
              <span className="footer-contact-value">{site.siteAddress}</span>
            </div>
          </div>
          <div className="footer-contact">
            <span className="footer-ico" aria-hidden="true">
              <span className="gallery-ico gallery-ico-envelope" />
            </span>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Email</span>
              <a className="footer-contact-value" href={`mailto:${site.enquiryEmail}`}>
                {site.enquiryEmail}
              </a>
            </div>
          </div>
          <div className="footer-contact">
            <span className="footer-ico" aria-hidden="true">
              <span className="gallery-ico gallery-ico-globe" />
            </span>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Website</span>
              <a
                className="footer-contact-value"
                href={site.companyUrl}
                rel="noopener noreferrer"
              >
                www.ewdevelopers.com
              </a>
            </div>
          </div>
        </div>

        <nav className="footer-quick" aria-label="Quick links">
          <h2 className="footer-quick-title">Quick Links</h2>
          <ul className="footer-quick-list">
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/#plots">Plots</Link>
            </li>
            <li>
              <Link href="/#location">Map</Link>
            </li>
            <li>
              <Link href="/#about">About Us</Link>
            </li>
            <li>
              <Link href="/#gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/#documents">Documentation</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-vrule" aria-hidden="true" />

        <div className="footer-art">
          <picture className="footer-landscape">
            <img
              src="/assets/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%95%E0%A5%83%E0%A4%B7%E0%A5%8D%E0%A4%A3%20%E0%A4%97%E0%A5%8B%E0%A4%B5%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%20%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A4%B9%E0%A4%B0%E0%A5%80%20%E0%A4%AA%E0%A4%B9%E0%A4%BE%E0%A4%A1%E0%A4%BC%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%81.png"
              alt=""
              width={1792}
              height={877}
            />
          </picture>
        </div>
      </div>

      <div className="footer-hrule" aria-hidden="true" />

      <div className="footer-bar">
        <p className="footer-rera">
          <span>Project RERA No. {site.rera}</span>
          <span className="footer-rera-sep" aria-hidden="true">
            {" "}
            ·{" "}
          </span>
          <a href={site.reraUrl} rel="noopener noreferrer">
            www.up-rera.in
          </a>
        </p>
        <p className="footer-links">
          <Link href="/disclaimer-privacy#privacy">Privacy Policy</Link>
          <span className="sep" aria-hidden="true">
            |
          </span>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </p>
        <p className="footer-copy">
          © 2026 Earthwaves Developers Private Limited. All Rights Reserved.
        </p>
        <a className="footer-top" href={topHref} aria-label="Back to top">
          <span className="gallery-ico gallery-ico-caret-left" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
