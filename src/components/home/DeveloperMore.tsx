"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEVELOPER_LIMIT = 100;

function developerWords(text: string) {
  const trimmed = (text || "").trim();
  return trimmed ? trimmed.split(/\s+/) : [];
}

function truncateRichNode(
  source: Node,
  remaining: { count: number },
): Node {
  const clone = source.cloneNode(false) as Node;
  const nodes = Array.from(source.childNodes);

  for (let i = 0; i < nodes.length; i += 1) {
    if (remaining.count <= 0) break;
    const child = nodes[i];

    if (child.nodeType === Node.TEXT_NODE) {
      const words = developerWords(child.nodeValue || "");
      if (!words.length) {
        clone.appendChild(document.createTextNode(child.nodeValue || ""));
        continue;
      }
      if (words.length <= remaining.count) {
        clone.appendChild(document.createTextNode(child.nodeValue || ""));
        remaining.count -= words.length;
      } else {
        clone.appendChild(
          document.createTextNode(
            `${words.slice(0, remaining.count).join(" ")}…`,
          ),
        );
        remaining.count = 0;
      }
      continue;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      const nested = truncateRichNode(child, remaining);
      if (nested.textContent) clone.appendChild(nested);
    }
  }

  return clone;
}

export function DeveloperMore() {
  const sourceRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[] | null>(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wordTotal, setWordTotal] = useState(0);

  const showToggle = isMobile && wordTotal > DEVELOPER_LIMIT;
  const expanded = showToggle && open;

  const renderDeveloperCopy = useCallback(() => {
    const developerBody = bodyRef.current;
    const developerNodes = nodesRef.current;
    if (!developerBody || !developerNodes) return;

    developerBody.textContent = "";
    if (!showToggle || open) {
      developerNodes.forEach((node) => {
        developerBody.appendChild(node.cloneNode(true));
      });
      return;
    }

    const remaining = { count: DEVELOPER_LIMIT };
    developerNodes.forEach((node) => {
      if (remaining.count <= 0) return;
      const words = developerWords(node.textContent || "");
      if (words.length <= remaining.count) {
        developerBody.appendChild(node.cloneNode(true));
        remaining.count -= words.length;
        return;
      }
      developerBody.appendChild(truncateRichNode(node, remaining));
    });
  }, [open, showToggle]);

  useEffect(() => {
    const source = sourceRef.current;
    if (!source || nodesRef.current) return;

    const nodes = Array.from(source.querySelectorAll("p")).map((p) =>
      p.cloneNode(true),
    );
    nodesRef.current = nodes;
    const total = nodes.reduce(
      (sum, node) => sum + developerWords(node.textContent || "").length,
      0,
    );
    setWordTotal(total);
  }, []);

  useEffect(() => {
    const developerQuery = window.matchMedia("(max-width: 767px)");
    const syncMobile = () => setIsMobile(developerQuery.matches);
    syncMobile();
    developerQuery.addEventListener("change", syncMobile);
    return () => developerQuery.removeEventListener("change", syncMobile);
  }, []);

  useEffect(() => {
    renderDeveloperCopy();
  }, [renderDeveloperCopy]);

  return (
    <>
      <div ref={sourceRef} hidden aria-hidden>
        <p>
          Earthwaves Developers Private Limited is an emerging and progressive
          name in the Delhi-NCR real estate landscape, driven by a management
          team with over 15 years of extensive experience in real estate
          development and the regional property market. Built on a strong
          understanding of land, location and evolving homebuyer aspirations,
          the company is committed to creating thoughtfully planned residential
          communities that offer a fulfilling lifestyle and enduring value.
        </p>
        <p>
          Just 500 metres from MADHAVAM,{" "}
          <span className="text-gold">
            Earthwaves successfully delivered Radhe Radhe Aaradhayam, a
            residential plotted development comprising 71 plots, within a span
            of just two years.
          </span>{" "}
          This successful completion reflects the Group’s focus on timely
          execution, thoughtful planning, quality development and customer
          commitment, while strengthening its presence and credibility in the
          region.
        </p>
        <p>
          With a vision to bring back the timeless significance of land ownership,
          Earthwaves is redefining residential living through its distinctive
          concept of “Plotted Development for Housing.” The philosophy is to give
          families the freedom of owning their own piece of land and the
          opportunity to create a home that truly reflects their lifestyle,
          aspirations and future.
        </p>
        <p>
          At Earthwaves, development goes beyond creating plots and
          infrastructure. Every customer is considered part of the extended
          family, inspiring communities built on trust, transparency, quality,
          commitment and long-term value. With every development, Earthwaves
          strives to deliver on its promises and create addresses where families
          can grow, prosper and build lasting memories for generations.
        </p>
      </div>
      <div className="developer-body" id="developerBody" ref={bodyRef} />
      <button
        type="button"
        className={`developer-more${expanded ? " is-open" : ""}`}
        id="developerMore"
        hidden={!showToggle}
        aria-expanded={expanded}
        aria-controls="developerBody"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="developer-more-label">
          {expanded ? "Read less" : "Read more"}
        </span>
        <svg
          className="developer-more-arrow"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M3.2 10.2 8 5.4l4.8 4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
