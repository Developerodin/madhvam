import { Reveal } from "@/components/motion/Reveal";

export function TrackRecord() {
  return (
    <section
      className="paper band aaradhayam"
      id="track-record"
      aria-labelledby="aaradhayamTitle"
    >
      <div className="sheet">
        <Reveal className="aaradhayam-head">
          <h2 id="aaradhayamTitle">
            Aaradhayam <span className="text-gold">by Earthwaves</span>.
          </h2>
          <div className="title-arrows title-arrows--start" aria-hidden="true">
            <span className="pillar-arrow pillar-arrow--flip" />
            <span className="pillar-arrow" />
          </div>
          <p className="lead-copy">
            Just 500 metres from Madhavam, Earthwaves Aaradhayam is a completed
            71-plot residential township near Raj Nagar Extension — handed over on
            schedule and built to the standards buyers can expect here.
          </p>
        </Reveal>
        <Reveal as="ul" className="aaradhayam-facts">
          <li>
            <h3>UP RERA</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              Registered as UPRERAPRJ458010 — a separate, completed project from
              Madhavam.
            </p>
          </li>
          <li>
            <h3>Plot sizes</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>Typically 1,080 to 1,125 sq. ft. — planned for family homes.</p>
          </li>
          <li>
            <h3>On-time delivery</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              Scheduled completion around October 2025 — delivered within the
              planned timeline.
            </p>
          </li>
          <li>
            <h3>Township infrastructure</h3>
            <span className="pillar-arrow" aria-hidden="true" />
            <p>
              Internal pucca roads, boundary wall, 24-hour water, street
              lighting, drainage with STP, and dedicated parks.
            </p>
          </li>
        </Reveal>
      </div>
      <Reveal
        className="aaradhayam-marquee"
        aria-label="Earthwaves Aaradhayam project gallery"
      >
        <div className="aaradhayam-marquee-track">
          <div className="aaradhayam-marquee-set">
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-living-dining.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-living-dining.jpg"
                  alt="Aaradhayam living and dining interior"
                  width={1024}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-kitchen-dining.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-kitchen-dining.jpg"
                  alt="Aaradhayam kitchen and dining space"
                  width={1024}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-landscaping.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-landscaping.jpg"
                  alt="Aaradhayam landscaped walkway at dusk"
                  width={695}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-living-lounge.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-living-lounge.jpg"
                  alt="Aaradhayam open-plan living lounge"
                  width={1024}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
          </div>
          <div className="aaradhayam-marquee-set" aria-hidden="true">
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-living-dining.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-living-dining.jpg"
                  alt=""
                  width={1024}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-kitchen-dining.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-kitchen-dining.jpg"
                  alt=""
                  width={1024}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-landscaping.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-landscaping.jpg"
                  alt=""
                  width={695}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <figure className="aaradhayam-slide">
              <picture>
                <source
                  srcSet="/assets/aaradhayam-living-lounge.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/aaradhayam-living-lounge.jpg"
                  alt=""
                  width={1024}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
