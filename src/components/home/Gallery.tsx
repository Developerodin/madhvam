"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { GALLERY_FILTERS, GALLERY_SLIDES, type GallerySlide } from "@/data/gallery";

const LEAF = (
  <svg className="gallery-leaf" viewBox="0 0 72 118" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.15">
      <path d="M36 108c0-28-14-42-18-68" />
      <path d="M18 40c10-2 18 10 18 24" />
      <path d="M36 86c16-8 28-22 24-40" />
      <path d="M60 46c-10 2-18 14-20 26" />
      <path d="M34 98c-12-4-22-16-20-30" />
      <path d="M14 68c8 2 14 10 16 18" />
      <path d="M36 70c8-18 8-32 2-44" />
      <path d="M38 26c6 8 8 18 6 28" />
    </g>
  </svg>
);

function hasMedia(slide: GallerySlide) {
  return !!(slide.png || slide.webp || slide.placeholder);
}

function matches(slide: GallerySlide, filter: string) {
  if (slide.category === filter) return true;
  if (Array.isArray(slide.also)) return slide.also.includes(filter);
  return slide.also === filter;
}

function GalleryCard({
  slide,
  feature,
  hidden,
}: {
  slide: GallerySlide;
  feature?: boolean;
  hidden?: boolean;
}) {
  let media: React.ReactNode = null;
  if (slide.png || slide.webp) {
    const img = (
      <img
        src={slide.png || slide.webp}
        alt={slide.title}
        className={slide.contain ? "is-contain" : undefined}
      />
    );
    media =
      slide.webp && slide.png ? (
        <picture>
          <source srcSet={slide.webp} type="image/webp" />
          {img}
        </picture>
      ) : (
        img
      );
  }

  const caption = feature ? (
    <p className="gallery-feature-title">
      {(slide.lines || [slide.title]).map((line, i) => (
        <span key={line}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  ) : (
    <>
      <p className="gallery-card-title">{slide.title}</p>
      {slide.caption ? <p className="gallery-card-caption">{slide.caption}</p> : null}
    </>
  );

  return (
    <article
      className={`gallery-card${feature ? " gallery-feature" : ""}${slide.placeholder ? " is-placeholder" : ""}`}
      aria-hidden={hidden || undefined}
    >
      <div className="gallery-media">{media}</div>
      {feature ? LEAF : null}
      <div className="gallery-caption">{caption}</div>
    </article>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState("all");
  const [desktop, setDesktop] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onVis = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const looping = filter === "all" && desktop && !reduceMotion && visible;
  const feature = useMemo(
    () => GALLERY_SLIDES.find((s) => s.feature) || null,
    [],
  );

  const pool = useMemo(() => {
    return GALLERY_SLIDES.filter((slide) => {
      if (filter === "all") return !slide.feature && hasMedia(slide);
      return matches(slide, filter);
    });
  }, [filter]);

  const revealPill = useCallback((item: HTMLElement) => {
    const scroller = item.parentElement;
    if (!scroller) return;
    const viewLeft = scroller.scrollLeft;
    const viewRight = viewLeft + scroller.clientWidth;
    const itemLeft = item.offsetLeft;
    const itemRight = itemLeft + item.offsetWidth;
    if (itemLeft >= viewLeft && itemRight <= viewRight) return;
    const left = itemLeft - (scroller.clientWidth - item.offsetWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, []);

  const setGalleryFilter = useCallback(
    (next: string) => {
      setFilter(next);
      requestAnimationFrame(() => {
        const pills = pillsRef.current?.querySelectorAll<HTMLElement>(".gallery-pill");
        pills?.forEach((item) => {
          if ((item.getAttribute("data-filter") || "all") === next) {
            revealPill(item);
          }
        });
      });
    },
    [revealPill],
  );

  function shiftFilter(dir: number) {
    const ids = GALLERY_FILTERS.map((f) => f.id);
    const index = ids.indexOf(filter as (typeof ids)[number]);
    const next = ids[(index + dir + ids.length) % ids.length];
    setGalleryFilter(next);
  }

  let layout: "marquee" | "mosaic" | "grid" = "mosaic";
  let stage: React.ReactNode = null;

  if (filter === "all") {
    if (looping && pool.length) {
      layout = "marquee";
      stage = (
        <div className="gallery-mosaic is-marquee">
          {feature ? <GalleryCard slide={feature} feature /> : null}
          <div className="gallery-marquee">
            <div className="gallery-marquee-track">
              {pool.map((slide) => (
                <GalleryCard key={`a-${slide.title}`} slide={slide} />
              ))}
              {pool.map((slide) => (
                <GalleryCard key={`b-${slide.title}`} slide={slide} hidden />
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      layout = "mosaic";
      const visibleCards = pool.slice(0, 4);
      const items = feature ? [feature, ...visibleCards] : visibleCards;
      stage = (
        <div className="gallery-mosaic">
          {items.map((slide) => (
            <GalleryCard
              key={slide.title}
              slide={slide}
              feature={!!slide.feature}
            />
          ))}
        </div>
      );
    }
  } else {
    layout = "grid";
    stage = (
      <div className="gallery-grid">
        {pool.filter(hasMedia).map((slide) => (
          <GalleryCard key={slide.title} slide={slide} />
        ))}
      </div>
    );
  }

  return (
    <section className="paper band gallery" id="gallery">
      <div className="sheet">
        <Reveal className="gallery-head">
          <div className="gallery-copy">
            <h2 className="gallery-title">
              <span className="gallery-title-line">A Glimpse of</span>{" "}
              <span className="gallery-title-name">Madhavam</span>
            </h2>
            <div className="title-arrows title-arrows--start" aria-hidden="true">
              <span className="pillar-arrow pillar-arrow--flip" />
              <span className="pillar-arrow" />
            </div>
            <p className="gallery-intro">
              Explore the thoughtfully designed spaces, green landscapes and modern
              amenities that make Madhavam a place to live, grow and belong.
            </p>
          </div>
          <ul className="gallery-highlights">
            <li>
              <span className="gallery-ico gallery-ico-leaf" aria-hidden="true" />
              <span>Green Surroundings</span>
            </li>
            <li>
              <span className="gallery-ico gallery-ico-house" aria-hidden="true" />
              <span>
                Modern
                <br />
                Living
              </span>
            </li>
            <li>
              <span className="gallery-ico gallery-ico-users" aria-hidden="true" />
              <span>Vibrant Community</span>
            </li>
          </ul>
        </Reveal>

        <div className="gallery-board">
          <Reveal className="gallery-toolbar">
            <div
              className="gallery-pills"
              role="group"
              aria-label="Gallery categories"
              ref={pillsRef}
            >
              {GALLERY_FILTERS.map((item) => {
                const on = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`gallery-pill${on ? " is-active" : ""}`}
                    data-filter={item.id}
                    aria-pressed={on}
                    onClick={() => setGalleryFilter(item.id)}
                  >
                    <span className={`gallery-ico ${item.icon}`} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div
            className={`gallery-stage reveal is-in${looping ? " is-looping" : ""}`}
            id="galleryStage"
            data-layout={layout}
            aria-live="polite"
          >
            {stage}
          </div>

          <div className="gallery-arrows">
            <button
              type="button"
              className="gallery-arrow"
              aria-label="Previous photos"
              onClick={() => shiftFilter(-1)}
            >
              <span className="gallery-ico gallery-ico-caret-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gallery-arrow"
              aria-label="Next photos"
              onClick={() => shiftFilter(1)}
            >
              <span className="gallery-ico gallery-ico-caret-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
