"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

const MAP_SRC =
  "/assets/Screenshot%202026-10-08%20at%205.37.51%E2%80%AFPM.png";

export function Location() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  const [expanded, setExpanded] = useState(false);
  const mapScale = useRef(1);
  const panX = useRef(0);
  const panY = useRef(0);
  const mapPointers = useRef(new Map<number, { x: number; y: number }>());
  const mapDrag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  const mapPinch = useRef<{
    dist: number;
    scale: number;
    x: number;
    y: number;
  } | null>(null);
  const mapMin = 1;
  const mapMax = 5;

  const applyMapTransform = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    img.style.setProperty("--map-scale", String(mapScale.current));
    img.style.setProperty("--pan-x", panX.current + "px");
    img.style.setProperty("--pan-y", panY.current + "px");
  }, []);

  const clampMapPan = useCallback(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return;
    const stageRect = stage.getBoundingClientRect();
    const baseW = img.offsetWidth;
    const baseH = img.offsetHeight;
    const maxX = Math.max(0, (baseW * mapScale.current - stageRect.width) / 2);
    const maxY = Math.max(0, (baseH * mapScale.current - stageRect.height) / 2);
    panX.current = Math.max(-maxX, Math.min(maxX, panX.current));
    panY.current = Math.max(-maxY, Math.min(maxY, panY.current));
  }, []);

  const setMapScale = useCallback(
    (next: number, originX?: number, originY?: number) => {
      const prev = mapScale.current;
      mapScale.current = Math.max(mapMin, Math.min(mapMax, next));
      if (originX != null && originY != null && prev > 0) {
        const ratio = mapScale.current / prev;
        panX.current = originX - (originX - panX.current) * ratio;
        panY.current = originY - (originY - panY.current) * ratio;
      }
      if (mapScale.current === mapMin) {
        panX.current = 0;
        panY.current = 0;
      } else {
        clampMapPan();
      }
      applyMapTransform();
    },
    [applyMapTransform, clampMapPan],
  );

  const resetMapView = useCallback(() => {
    mapScale.current = 1;
    panX.current = 0;
    panY.current = 0;
    applyMapTransform();
  }, [applyMapTransform]);

  const stageOrigin = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const rect = stage.getBoundingClientRect();
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  }, []);

  function openMap() {
    resetMapView();
    setExpanded(true);
    dialogRef.current?.showModal();
  }

  function closeMap() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onClose() {
      setExpanded(false);
      resetMapView();
      openBtnRef.current?.focus();
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest("[data-map-close]")) {
        dialog!.close();
        return;
      }
      const rect = dialog!.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) dialog!.close();
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setMapScale(mapScale.current * 1.25);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setMapScale(mapScale.current / 1.25);
      } else if (event.key === "0") {
        event.preventDefault();
        resetMapView();
      }
    }

    dialog.addEventListener("close", onClose);
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onClick);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [resetMapView, setMapScale]);

  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    function pinchDistance() {
      const points = Array.from(mapPointers.current.values());
      if (points.length < 2) return 0;
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const origin = stageOrigin(event.clientX, event.clientY);
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      setMapScale(mapScale.current * factor, origin.x, origin.y);
    }

    function onDblClick(event: MouseEvent) {
      event.preventDefault();
      resetMapView();
    }

    function onPointerDown(event: PointerEvent) {
      mapPointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      stageEl!.setPointerCapture(event.pointerId);
      if (mapPointers.current.size === 1) {
        mapPinch.current = null;
        mapDrag.current = {
          x: event.clientX,
          y: event.clientY,
          ox: panX.current,
          oy: panY.current,
        };
        stageEl!.classList.add("is-panning");
      } else if (mapPointers.current.size === 2) {
        mapDrag.current = null;
        const vals = Array.from(mapPointers.current.values());
        const mid = stageOrigin(
          (vals[0].x + vals[1].x) / 2,
          (vals[0].y + vals[1].y) / 2,
        );
        mapPinch.current = {
          dist: pinchDistance(),
          scale: mapScale.current,
          x: mid.x,
          y: mid.y,
        };
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (!mapPointers.current.has(event.pointerId)) return;
      mapPointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      if (
        mapPointers.current.size >= 2 &&
        mapPinch.current &&
        mapPinch.current.dist > 0
      ) {
        const dist = pinchDistance();
        setMapScale(
          mapPinch.current.scale * (dist / mapPinch.current.dist),
          mapPinch.current.x,
          mapPinch.current.y,
        );
        return;
      }
      if (!mapDrag.current || mapScale.current <= 1) return;
      panX.current = mapDrag.current.ox + (event.clientX - mapDrag.current.x);
      panY.current = mapDrag.current.oy + (event.clientY - mapDrag.current.y);
      clampMapPan();
      applyMapTransform();
    }

    function endMapPointer(event: PointerEvent) {
      mapPointers.current.delete(event.pointerId);
      if (mapPointers.current.size < 2) mapPinch.current = null;
      if (mapPointers.current.size === 0) {
        mapDrag.current = null;
        stageEl!.classList.remove("is-panning");
      } else if (mapPointers.current.size === 1) {
        const remaining = Array.from(mapPointers.current.values())[0];
        mapDrag.current = {
          x: remaining.x,
          y: remaining.y,
          ox: panX.current,
          oy: panY.current,
        };
      }
    }

    stageEl.addEventListener("wheel", onWheel, { passive: false });
    stageEl.addEventListener("dblclick", onDblClick);
    stageEl.addEventListener("pointerdown", onPointerDown);
    stageEl.addEventListener("pointermove", onPointerMove);
    stageEl.addEventListener("pointerup", endMapPointer);
    stageEl.addEventListener("pointercancel", endMapPointer);

    return () => {
      stageEl.removeEventListener("wheel", onWheel);
      stageEl.removeEventListener("dblclick", onDblClick);
      stageEl.removeEventListener("pointerdown", onPointerDown);
      stageEl.removeEventListener("pointermove", onPointerMove);
      stageEl.removeEventListener("pointerup", endMapPointer);
      stageEl.removeEventListener("pointercancel", endMapPointer);
    };
  }, [applyMapTransform, clampMapPan, resetMapView, setMapScale, stageOrigin]);

  return (
    <section className="location band" id="location">
      <div className="sheet">
        <Reveal as="h2" className="location-title">
          <span className="location-title-line">A Place to Own</span>
          <span className="location-title-main">A Life to Cherish.</span>
        </Reveal>
        <div className="title-arrows" aria-hidden="true">
          <span className="pillar-arrow pillar-arrow--flip" />
          <span className="pillar-arrow" />
        </div>
        <Reveal className="location-board">
          <ul className="location-col location-col-left">
            <li className="loc-item loc-item-left">
              <span className="loc-ico loc-ico-temple" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Akshardham Temple</strong>
                <span>25 Minutes</span>
              </span>
              <span className="loc-line" aria-hidden="true" />
            </li>
            <li className="loc-item loc-item-left">
              <span className="loc-ico loc-ico-metro" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Hindon River Metro</strong>
                <span>7 Minutes</span>
              </span>
              <span className="loc-line" aria-hidden="true" />
            </li>
            <li className="loc-item loc-item-left">
              <span className="loc-ico loc-ico-bridge" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Elevated Road</strong>
                <span>5 Minutes</span>
              </span>
              <span className="loc-line" aria-hidden="true" />
            </li>
            <li className="loc-item loc-item-left">
              <span className="loc-ico loc-ico-regional" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Namo Bharat</strong>
                <span>5 Minutes</span>
              </span>
              <span className="loc-line" aria-hidden="true" />
            </li>
          </ul>

          <button
            type="button"
            className="location-map"
            id="locationMapOpen"
            ref={openBtnRef}
            aria-haspopup="dialog"
            aria-controls="locationMapDialog"
            aria-expanded={expanded}
            onClick={openMap}
          >
            <img src={MAP_SRC} alt="" width={1448} height={1256} />
            <span className="location-map-cue">View map</span>
          </button>

          <ul className="location-col location-col-right">
            <li className="loc-item loc-item-right">
              <span className="loc-line" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Hindon Airport</strong>
                <span>15 Minutes</span>
              </span>
              <span className="loc-ico loc-ico-airplane" aria-hidden="true" />
            </li>
            <li className="loc-item loc-item-right">
              <span className="loc-line" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Eastern Peripheral Expressway</strong>
                <span>10 Minutes</span>
              </span>
              <span className="loc-ico loc-ico-road" aria-hidden="true" />
            </li>
            <li className="loc-item loc-item-right">
              <span className="loc-line" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Railway Station</strong>
                <span>8 Minutes</span>
              </span>
              <span className="loc-ico loc-ico-train" aria-hidden="true" />
            </li>
            <li className="loc-item loc-item-right">
              <span className="loc-line" aria-hidden="true" />
              <span className="loc-copy">
                <strong>Proposed BCCI Cricket Stadium</strong>
                <span>10 Minutes</span>
              </span>
              <span className="loc-ico loc-ico-cricket" aria-hidden="true" />
            </li>
          </ul>
        </Reveal>
      </div>

      <img
        className="location-horizon"
        src="/assets/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%95%E0%A5%83%E0%A4%B7%E0%A5%8D%E0%A4%A3%20%E0%A4%97%E0%A5%8B%E0%A4%B5%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%20%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A4%B9%E0%A4%B0%E0%A5%80%20%E0%A4%AA%E0%A4%B9%E0%A4%BE%E0%A4%A1%E0%A4%BC%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%81.png"
        alt=""
        width={1792}
        height={877}
      />

      <Reveal className="location-connect">
        <p className="location-connect-kicker">Well Connected</p>
        <h3 className="location-connect-title">
          <span className="location-connect-lead">Everything</span>
          <span className="location-connect-accent">within reach.</span>
        </h3>
      </Reveal>

      <dialog
        className="map-dialog"
        id="locationMapDialog"
        ref={dialogRef}
        aria-labelledby="locationMapTitle"
      >
        <div className="map-dialog-bar">
          <p id="locationMapTitle">Madhavam location map</p>
          <div className="map-dialog-tools">
            <button
              type="button"
              data-map-zoom="out"
              aria-label="Zoom out"
              onClick={() => setMapScale(mapScale.current * 0.8)}
            >
              −
            </button>
            <button
              type="button"
              data-map-zoom="in"
              aria-label="Zoom in"
              onClick={() => setMapScale(mapScale.current * 1.25)}
            >
              +
            </button>
            <button type="button" data-map-zoom="reset" onClick={resetMapView}>
              Reset
            </button>
            <button
              type="button"
              className="map-dialog-close"
              data-map-close
              aria-label="Close map"
              onClick={closeMap}
            >
              Close
            </button>
          </div>
        </div>
        <div className="map-dialog-stage" id="locationMapStage" ref={stageRef}>
          <img
            id="locationMapImg"
            ref={imgRef}
            src={MAP_SRC}
            alt="Connectivity map showing Madhavam near Harnandipuram, Hindon Airport, Meerut Road, and nearby landmarks"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </dialog>
    </section>
  );
}
