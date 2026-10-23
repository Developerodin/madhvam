"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSite } from "@/lib/site-context";

export function Hero() {
  const site = useSite();
  const hero = site.hero;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    video.setAttribute("fetchpriority", "high");

    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
    }
  }, []);

  return (
    <section className="hero" id="top">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={hero.poster}
      >
        <source src={hero.videoWebm} type="video/webm" />
        <source src={hero.videoMp4} type="video/mp4" />
      </video>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-kicker">{hero.kicker}</p>
        <div className="title-arrows" aria-hidden="true">
          <span className="pillar-arrow pillar-arrow--flip" />
          <span className="pillar-arrow" />
        </div>
        <h1>
          <span className="hero-title-lead">{hero.titleLead}</span>
          <br />
          <span className="hero-title-accent">{hero.titleAccent}</span>
        </h1>
        <div className="title-arrows" aria-hidden="true">
          <span className="pillar-arrow pillar-arrow--flip" />
          <span className="pillar-arrow" />
        </div>
        <p className="hero-line">{hero.line}</p>
        <div className="hero-actions">
          <Link className="btn btn-hero" href="/contact">
            {hero.ctaPrimary}
          </Link>
          <Link className="btn btn-hero btn-hero-ghost" href="/contact">
            {hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
