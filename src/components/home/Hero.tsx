"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function Hero() {
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
        poster="/assets/hero-poster.webp"
      >
        <source src="/assets/hero.webm" type="video/webm" />
        <source src="/assets/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-kicker">Madhavam</p>
        <div className="title-arrows" aria-hidden="true">
          <span className="pillar-arrow pillar-arrow--flip" />
          <span className="pillar-arrow" />
        </div>
        <h1>
          <span className="hero-title-lead">Land is the</span>
          <br />
          <span className="hero-title-accent">New Gold</span>
        </h1>
        <div className="title-arrows" aria-hidden="true">
          <span className="pillar-arrow pillar-arrow--flip" />
          <span className="pillar-arrow" />
        </div>
        <p className="hero-line">
          Approved gated residential plots amidst nature
        </p>
        <div className="hero-actions">
          <Link className="btn btn-hero" href="/contact">
            Enquire Now
          </Link>
          <Link className="btn btn-hero btn-hero-ghost" href="/contact">
            Book a Site Visit
          </Link>
        </div>
      </div>
    </section>
  );
}
