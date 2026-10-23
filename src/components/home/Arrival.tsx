"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

function buildArrivalDesktopTimeline(
  words: NodeListOf<Element>,
  rule: Element | null,
  items: NodeListOf<Element>,
) {
  const tl = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { ease: "power3.out" },
  });

  gsap.set(words, {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
    clearProps: "position,left,right,top",
  });
  if (rule) gsap.set(rule, { opacity: 0, scaleX: 0 });
  gsap.set(items, {
    opacity: 0,
    y: 42,
    filter: "blur(10px)",
    clearProps: "position,left,right,top",
  });

  tl.to(
    words,
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      stagger: 0.08,
      ease: "power3.out",
    },
    0.15,
  );

  if (rule) {
    tl.to(
      rule,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.7,
        ease: "power2.out",
      },
      "-=0.35",
    );
  }

  tl.to(
    items,
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 1.05,
      ease: "power3.out",
    },
    "-=0.15",
  );

  tl.to({}, { duration: 2.8 });

  tl.to(items, {
    opacity: 0,
    y: -18,
    filter: "blur(6px)",
    duration: 0.55,
    stagger: { each: 0.07, from: "end" },
    ease: "power2.in",
  });

  if (rule) {
    tl.to(
      rule,
      {
        opacity: 0,
        scaleX: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.35",
    );
  }

  tl.to(
    words,
    {
      opacity: 0,
      y: -14,
      filter: "blur(6px)",
      duration: 0.5,
      stagger: { each: 0.04, from: "end" },
      ease: "power2.in",
    },
    "-=0.3",
  );

  tl.to({}, { duration: 0.55 });

  return tl;
}

function buildArrivalMobileTimeline(
  words: NodeListOf<Element>,
  rule: Element | null,
  items: NodeListOf<Element>,
) {
  const tl = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { ease: "power3.out" },
  });
  const pairGapEm = 3.2;
  const pairSize = 2;
  let pairIndex = 0;
  let lastPair: Element[] = [];

  gsap.set(words, { opacity: 0, y: 22, filter: "blur(8px)" });
  if (rule) gsap.set(rule, { opacity: 0, scaleX: 0 });
  gsap.set(items, {
    opacity: 0,
    y: "1.6em",
    filter: "blur(10px)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  });

  tl.to(
    words,
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 0.07,
      ease: "power3.out",
    },
    0.12,
  );

  if (rule) {
    tl.to(
      rule,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3",
    );
  }

  for (let i = 0; i < items.length; i += pairSize) {
    const pair: Element[] = [];
    const prevPair: Element[] = [];
    for (let p = 0; p < pairSize && i + p < items.length; p++) {
      pair.push(items[i + p]);
    }
    lastPair = pair;

    if (pairIndex > 0) {
      for (let p = 0; p < pairSize && i - pairSize + p < i; p++) {
        prevPair.push(items[i - pairSize + p]);
      }
      tl.to(
        prevPair,
        {
          opacity: 0,
          y: "-1.4em",
          filter: "blur(7px)",
          duration: 0.9,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        ">+0.2",
      );
    }

    for (let p = 0; p < pair.length; p++) {
      const slotY = p * pairGapEm + "em";
      const fromY = p * pairGapEm + 1.5 + "em";
      const enterAt =
        pairIndex === 0 && p === 0
          ? "-=0.05"
          : p === 0
            ? "<+=0.18"
            : "<+=0.1";

      tl.fromTo(
        pair[p],
        {
          opacity: 0,
          y: fromY,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: slotY,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        enterAt,
      );
    }

    tl.to({}, { duration: 1.45 });
    pairIndex += 1;
  }

  tl.to({}, { duration: 0.55 });

  tl.to(lastPair, {
    opacity: 0,
    y: "-=1.1em",
    filter: "blur(6px)",
    duration: 0.6,
    stagger: 0.06,
    ease: "power2.in",
  });

  if (rule) {
    tl.to(
      rule,
      {
        opacity: 0,
        scaleX: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.3",
    );
  }

  tl.to(
    words,
    {
      opacity: 0,
      y: -12,
      filter: "blur(6px)",
      duration: 0.5,
      stagger: { each: 0.04, from: "end" },
      ease: "power2.in",
    },
    "-=0.3",
  );

  tl.to({}, { duration: 0.5 });

  return tl;
}

const BENEFITS = [
  "Freehold, GDA approved land.",
  "Full design freedom.",
  "Land appreciates independently of construction.",
  "Located in centre of Raj Nagar Extension, Ghaziabad.",
  "A peaceful, low-density oasis amid the area's high-rise clutter.",
  "24x7 gated security with controlled, single-point access.",
  "Dedicated common areas (Clubhouse, Park, Courts).",
  "DG power backup for common facilities.",
];

export function Arrival() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const inViewRef = useRef(false);
  const [mode, setMode] = useState<"anim" | "static" | "no-overlay">("anim");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setMode("static");
      return;
    }
    const mq = window.matchMedia("(max-width: 767.98px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || mode !== "anim") return;

      const words = root.querySelectorAll(".arrival-word");
      const rule = root.querySelector(".title-arrows");
      const items = root.querySelectorAll(".arrival-benefits li");
      if (!words.length || !items.length) {
        setMode("no-overlay");
        return;
      }

      try {
        timelineRef.current = mobile
          ? buildArrivalMobileTimeline(words, rule, items)
          : buildArrivalDesktopTimeline(words, rule, items);
      } catch {
        timelineRef.current = null;
        setMode("no-overlay");
        return;
      }

      if (inViewRef.current) timelineRef.current.play(0);

      return () => {
        timelineRef.current?.kill();
        timelineRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [mode, mobile] },
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function playVideo() {
      const video = videoRef.current;
      if (!video || mode === "static") return;
      void video.play().catch(() => {});
    }

    function pauseVideo() {
      videoRef.current?.pause();
    }

    function onEnter() {
      inViewRef.current = true;
      playVideo();
      if (timelineRef.current?.paused()) timelineRef.current.play();
    }

    function onLeave() {
      inViewRef.current = false;
      pauseVideo();
      timelineRef.current?.pause();
    }

    if (mode === "static") return;

    if ("IntersectionObserver" in window) {
      const watch = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) onEnter();
          else onLeave();
        },
        { threshold: 0.45 },
      );
      watch.observe(root);
      return () => watch.disconnect();
    }

    onEnter();
  }, [mode]);

  const className = [
    "arrival",
    mode === "static" ? "arrival--static" : "",
    mode === "no-overlay" ? "arrival--no-overlay" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={className}
      id="arrival"
      ref={rootRef}
      aria-label="Film of the Madhavam gate and community"
    >
      <video
        ref={videoRef}
        className="arrival-video"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/radhe-radhe-gate-poster.webp"
        disablePictureInPicture
      >
        <source
          src="/assets/radhe-radhe-gate-to-aerial-15s-kling.webm"
          type="video/webm"
        />
        <source
          src="/assets/radhe-radhe-gate-to-aerial-15s-kling.mp4"
          type="video/mp4"
        />
      </video>
      <div className="arrival-scrim" aria-hidden="true" />
      <div className="arrival-overlay" aria-live="polite">
        <div className="arrival-copy">
          <h2 className="arrival-title">
            <span className="arrival-title-line">
              <span className="arrival-word">The</span>{" "}
              <span className="arrival-word">Benefits</span>{" "}
              <span className="arrival-word">of</span>
            </span>
            <span className="arrival-title-line">
              <span className="arrival-word">Living</span>{" "}
              <span className="arrival-word">in</span>{" "}
              <span className="arrival-word">Madhavam</span>
            </span>
          </h2>
          <div className="title-arrows title-arrows--start" aria-hidden="true">
            <span className="pillar-arrow pillar-arrow--flip" />
            <span className="pillar-arrow" />
          </div>
          <ul className="arrival-benefits">
            {BENEFITS.map((text) => (
              <li key={text}>
                <span className="arrival-benefit-inner">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
