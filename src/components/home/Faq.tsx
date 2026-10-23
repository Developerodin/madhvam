"use client";

import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";
import { useState } from "react";

export function Faq() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <section className="paper band faq" id="faq" aria-labelledby="faqTitle">
      <div className="sheet">
        <Reveal className="faq-head">
          <h2 id="faqTitle">
            Questions about <span className="text-gold">Madhavam</span>
          </h2>
          <div className="title-arrows title-arrows--start" aria-hidden="true">
            <span className="pillar-arrow pillar-arrow--flip" />
            <span className="pillar-arrow" />
          </div>
          <p className="lead-copy">
            Clear answers for buyers exploring gated residential plots in
            Rajnagar Extension, Delhi NCR.
          </p>
        </Reveal>
        <div className="faq-list">
          <Reveal as="details" className="faq-item">
            <summary>What is Madhavam?</summary>
            <p>
              Madhavam is an approved gated residential plotted development by
              Earth Waves Developers (Earthwaves Developers Pvt Ltd) at Rajnagar
              Extension, Ghaziabad, Delhi NCR. The brochure describes about 4
              acres with 87 thoughtfully planned freehold, GDA-approved plots,
              landscaped outdoor living, and a clubhouse of about 5,500 sq. ft. UP
              RERA registration number UPRERAPRJ245925/09/2026; Authority website{" "}
              <a href="https://www.up-rera.in/" rel="noopener noreferrer">
                https://www.up-rera.in
              </a>
              .
            </p>
          </Reveal>
          <Reveal as="details" className="faq-item">
            <summary>Where is Madhavam in Delhi NCR?</summary>
            <p>
              Madhavam is at KH. No.385M, 386M, Bhowapur, Raj Nagar Extension,
              Ghaziabad, Uttar Pradesh, 201017 — on the Ghaziabad side of Delhi
              NCR, serving buyers from Delhi, Noida, Ghaziabad, Faridabad, and
              Gurugram.
            </p>
          </Reveal>
          <Reveal as="details" className="faq-item">
            <summary>Who is developing Madhavam?</summary>
            <p>
              Madhavam is developed by Earthwaves Developers Pvt Ltd (Earth Waves
              Developers), GSTIN 09AADCE7736P1ZX. The corporate office is at G1,
              South Extension II, New Delhi. Nearby, Earthwaves delivered Radhe
              Radhe Aaradhayam (71 plots), about 500 metres from Madhavam — a
              separate project.
            </p>
          </Reveal>
          <Reveal as="details" className="faq-item">
            <summary>What amenities does Madhavam include?</summary>
            <p>
              Outdoor amenities include a lush green lawn with jogging track, kids
              play area, park gazebo, sculpture platform, badminton court, cricket
              net practice, yoga lawn, flower garden, and pet park. Indoor
              amenities in Club Madhavam (about 5,500 sq. ft.) include a
              multi-purpose hall with pantry, AC gymnasium, yoga and zumba room,
              indoor games room, and toddler play area. Common facilities include
              24x7 gated security and DG power backup for common areas.
            </p>
          </Reveal>
          <Reveal as="details" className="faq-item">
            <summary>How can I enquire about Madhavam or book a site visit?</summary>
            <p>
              Enquire via the <Link href="/contact">Contact Us page</Link>, email{" "}
              <a href="mailto:admin@earthwavesdevelopers.com">
                admin@earthwavesdevelopers.com
              </a>{" "}
              or{" "}
              <a href="mailto:sales@earthwavesdevelopers.com">
                sales@earthwavesdevelopers.com
              </a>
              , call <a href="tel:+918069982711">+91 80699 82711</a> (
              <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                WhatsApp
              </a>{" "}
              same), company IVR <a href="tel:+918826458080">+91 88264 58080</a>,
              or general <a href="tel:+919319976589">+91 93199 76589</a>. The
              sales desk aims to respond within one working day.
            </p>
          </Reveal>
          <div className="faq-more" id="faqMore" hidden={!moreOpen}>
            <Reveal as="details" className="faq-item">
              <summary>Is Madhavam suitable for buyers across Delhi NCR?</summary>
              <p>
                Yes. Madhavam is positioned for family buyers across Delhi NCR who
                want gated residential plots in Rajnagar Extension, Ghaziabad,
                with community amenities close to home.
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>
                What is the registry process, and what are the stamp duty and
                registry charges?
              </summary>
              <p>
                Registry steps and applicable stamp duty or registry charges are
                confirmed by Earth Waves Developers at the time of enquiry.
                Contact sales via the <Link href="/contact">Contact Us page</Link>,
                email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>
                What are the maintenance charges, and who maintains the common
                areas?
              </summary>
              <p>
                Maintenance charges and common-area upkeep arrangements are shared
                by Earth Waves Developers during enquiry. Reach the sales desk via
                the <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>
                Is club membership included, and is there a separate charge?
              </summary>
              <p>
                Club Madhavam membership terms and any separate charges are
                confirmed by Earth Waves Developers at enquiry. Contact sales via
                the <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>What is the possession timeline?</summary>
              <p>
                The current possession timeline for Madhavam is confirmed by Earth
                Waves Developers at the time of enquiry. Ask via the{" "}
                <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>
                Is there a deadline to start construction after possession?
              </summary>
              <p>
                Any post-possession construction deadlines are confirmed by Earth
                Waves Developers during enquiry. Contact sales via the{" "}
                <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>Can I resell or transfer my plot? What is the process?</summary>
              <p>
                Resale and transfer process details are shared by Earth Waves
                Developers at the time of enquiry. Reach sales via the{" "}
                <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>Can NRIs purchase a plot here?</summary>
              <p>
                NRI purchase eligibility and documentation requirements are
                confirmed by Earth Waves Developers during enquiry. Contact sales
                via the <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>Can I take a loan for the plot? Which banks fund it?</summary>
              <p>
                Plot loan options and participating banks are confirmed by Earth
                Waves Developers at the time of enquiry. Ask via the{" "}
                <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>
                What can I build on a 100 / 120 / 143 sq yd plot (floors,
                setbacks)?
              </summary>
              <p>
                Permitted floors, setbacks, and buildable area by plot size are
                confirmed by Earth Waves Developers during enquiry. Contact sales
                via the <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>What is the payment plan?</summary>
              <p>
                The current payment plan for Madhavam is shared by Earth Waves
                Developers at the time of enquiry. Reach sales via the{" "}
                <Link href="/contact">Contact Us page</Link>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                , or call <a href="tel:+918069982711">+91 80699 82711</a> (
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                same).
              </p>
            </Reveal>
            <Reveal as="details" className="faq-item">
              <summary>
                What plot sizes are available, and what is the current pricing?
              </summary>
              <p>
                Madhavam offers 87 residential plots in brochure size bands of about
                100, 103, 120, 125, 143 and 175 sq yd (plot numbers 01–73 and
                76–89; 74 and 75 are unused in the legend). Corner plots may differ
                in size. Tentative rate and amount/month from the project plot list
                are shown in the{" "}
                <a href="#plots">Plots and Pricing</a> section; final figures and
                live availability are confirmed by Earth Waves Developers — enquire
                via{" "}
                <a href="https://wa.me/918069982711" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                <a href="tel:+918069982711">+91 80699 82711</a>, email{" "}
                <a href="mailto:admin@earthwavesdevelopers.com">
                  admin@earthwavesdevelopers.com
                </a>{" "}
                /{" "}
                <a href="mailto:sales@earthwavesdevelopers.com">
                  sales@earthwavesdevelopers.com
                </a>
                .
              </p>
            </Reveal>
          </div>
        </div>
        <button
          type="button"
          className={`faq-more-btn${moreOpen ? " is-open" : ""}`}
          id="faqMoreBtn"
          aria-expanded={moreOpen}
          aria-controls="faqMore"
          onClick={() => setMoreOpen((prev) => !prev)}
        >
          <span className="faq-more-label">
            {moreOpen ? "Show less" : "Show more"}
          </span>
          <svg
            className="faq-more-arrow"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M3.2 5.8 8 10.6l4.8-4.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
