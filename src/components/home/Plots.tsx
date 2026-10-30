"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { MADHAVAM_PLOTS } from "@/data/plots";
import { initPlots } from "@/lib/plots/initPlots";
import { useSite } from "@/lib/site-context";

type PlotsProps = {
  plotsData?: typeof MADHAVAM_PLOTS | Record<string, unknown>;
};

export function Plots({ plotsData = MADHAVAM_PLOTS }: PlotsProps) {
  const site = useSite();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Clone data so mutations in initPlots (e.g. commercial flags) stay local
    const data = structuredClone(plotsData);
    return initPlots(root, data);
  }, [plotsData]);

  return (
    <section
      className="paper band plots"
      id="plots"
      ref={rootRef}
      aria-labelledby="plotsTitle"
    >
      <div className="sheet plots-sheet">
        <div className="plots-top">
          <Reveal className="plots-head">
            <p className="plots-kicker">
              <span className="plots-kicker-rule" aria-hidden="true" />
              Plots and Pricing
            </p>
            <h2 id="plotsTitle" className="plots-title">
              Plots and Pricing
            </h2>
            <p className="plots-intro">
              Choose from a range of premium residential plots designed for modern
              living. Explore the available inventory, sizes and prices, and find
              the plot that fits your plans.
            </p>
            <p className="plots-map-hint" id="plotsMapHint">
              <span className="plots-map-hint-ico" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M9 11.2V6.8a1.8 1.8 0 1 1 3.6 0v1.4" />
                  <path d="M12.6 8.2V6.5a1.5 1.5 0 1 1 3 0v2.2" />
                  <path d="M15.6 8.7V7.4a1.4 1.4 0 1 1 2.8 0v4.8c0 3.2-2 6.3-5.2 7.3-.5.2-1 .3-1.5.3H12c-3.3 0-6-2.5-6-5.6v-2.1a1.7 1.7 0 0 1 3.4 0v.9" />
                </svg>
              </span>
              Tap a plot to view details
            </p>
            <ul className="plots-legend" aria-label="Plot size and status legend">
              <li>
                <span className="plots-dot" style={{ background: "#E17B43" }} aria-hidden="true" />
                01–27 · 120 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#6781B8" }} aria-hidden="true" />
                28–36 · 125 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#E6DB29" }} aria-hidden="true" />
                37–60 · 100 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#BC93BF" }} aria-hidden="true" />
                61–71 · 143 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#C74D90" }} aria-hidden="true" />
                72–73 · 175 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#5FA86B" }} aria-hidden="true" />
                76–79 · 100 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#64BEDF" }} aria-hidden="true" />
                80–89 · ~103 yd²
              </li>
              <li>
                <span className="plots-dot" style={{ background: "#F09EBC" }} aria-hidden="true" />
                Commercial
              </li>
            </ul>

            <aside
              className="cost-calc cost-calc--page reveal is-in"
              id="costCalcPage"
              aria-labelledby="costCalcPageTitle"
              data-cost-calc="page"
            >
              <div className="cost-calc-head">
                <p className="cost-calc-kicker">Estimate</p>
                <h3 className="cost-calc-title" id="costCalcPageTitle">
                  Cost calculator
                </h3>
                <p className="cost-calc-lead">
                  Select a plot for an indicative ownership estimate. Figures are
                  placeholders until Earthwaves confirm final charges.
                </p>
              </div>
              <div className="cost-calc-field">
                <span className="cost-calc-label" id="costCalcPlotLabel">
                  Plot
                </span>
                <div className="cost-calc-dd" id="costCalcDropdown">
                  <button
                    type="button"
                    className="cost-calc-dd-trigger"
                    id="costCalcPlotSelect"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-controls="costCalcPlotList"
                    aria-labelledby="costCalcPlotLabel"
                  >
                    <span className="cost-calc-dd-value" id="costCalcPlotValue">
                      Select a plot
                    </span>
                    <span className="cost-calc-dd-chevron" aria-hidden="true">
                      <svg
                        viewBox="0 0 20 20"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 7.5l5 5 5-5" />
                      </svg>
                    </span>
                  </button>
                  <ul
                    className="cost-calc-dd-menu"
                    id="costCalcPlotList"
                    role="listbox"
                    aria-labelledby="costCalcPlotLabel"
                    hidden
                  />
                </div>
              </div>
              <div className="cost-calc-body" id="costCalcPageBody" hidden />
            </aside>
          </Reveal>

          <Reveal as="figure" className="plots-map" id="plotsMap" aria-label="Interactive site plan">
            <div className="plots-map-scroll">
              <svg
                className="plots-map-svg"
                id="plotsMapSvg"
                viewBox="0 0 422 1004"
                role="group"
                aria-label="Madhavam plot layout — tap a plot for details"
              />
            </div>
            <span className="plots-compass" aria-hidden="true" title="North">
              <svg viewBox="0 0 40 40" width="36" height="36">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="rgba(255,255,255,0.88)"
                  stroke="#6a1b1b"
                  strokeWidth="1.2"
                />
                <path
                  d="M20 8l4.5 18h-3.2l-1.3-5.2-1.3 5.2H15.5L20 8z"
                  fill="#6a1b1b"
                />
                <text
                  x="20"
                  y="34"
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="Outfit, sans-serif"
                  fill="#6a1b1b"
                  fontWeight="600"
                >
                  N
                </text>
              </svg>
            </span>
          </Reveal>
        </div>

        <Reveal className="plots-panel">
          <div className="plots-panel-head">
            <div>
              <h3 className="plots-panel-title">Plot Size Bands</h3>
              <p className="plots-panel-note">
                Sizes, tentative rate and amount/month from the project plot list.
                Tap a band or map plot for full details.
              </p>
            </div>
            <span className="plots-total">
              Total Plots: <strong>87</strong>
            </span>
          </div>

          <div className="plots-table-wrap">
            <table className="plots-table" id="plotsTable">
              <thead>
                <tr>
                  <th scope="col">Plot Numbers</th>
                  <th scope="col">Size (sq yd)</th>
                  <th scope="col">No. of Plots</th>
                  <th scope="col">Tentative Rate (per sq yd)</th>
                  <th scope="col">Amount / Month (Approx.)</th>
                  <th className="plots-table-chevron" aria-hidden="true" />
                </tr>
              </thead>
              <tbody>
                <BandRow band="1-27" size="119.65" label={<>01 – 27 <span className="plots-band-note">(incl. 12A)</span></>} sizeLabel="119.65" count="27" />
                <BandRow band="28-36" size="126.61" label="28 – 36" sizeLabel="124.91 – 128.83" count="9" />
                <BandRow band="37-60" size="100.5" label="37 – 60" sizeLabel="100.5 / 120.5" count="24" />
                <BandRow band="61-71" size="143.35" label="61 – 71" sizeLabel="143.35 / 156.25 / 158.15" count="11" />
                <BandRow band="72-73" size="175.85" label="72 – 73" sizeLabel="175.85" count="2" />
                <BandRow band="76-79" size="100.45" label="76 – 79" sizeLabel="100.45" count="4" />
                <BandRow band="80-89" size="103.1" label="80 – 89" sizeLabel="103.1 / 121.15" count="10" />
                <BandRow band="commercial" size="1105.88" label="Commercial" sizeLabel="1105.88" count="1" staticRow />
              </tbody>
            </table>
          </div>
          <div className="plots-band-chips" id="plotsBandChips" hidden />
        </Reveal>

        <Reveal as="ul" className="plots-payment" aria-label="Payment plan highlights">
          <li>Booking amount and milestones shared at enquiry</li>
          <li>Installments as per Builder-Buyer Agreement</li>
          <li>Final charges as per registered documents</li>
        </Reveal>
      </div>

      <div className="plots-cta">
        <div className="plots-cta-inner sheet">
          <a
            className="plots-wa-btn"
            href={`${site.whatsapp}?text=${encodeURIComponent("Hi, I'd like the latest pricing and inventory for Madhavam, Raj Nagar Extension.")}`}
            rel="noopener noreferrer"
          >
            <span className="plots-wa-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
            </span>
            <span className="plots-wa-label">
              Get Latest Pricing &amp; Inventory on WhatsApp
            </span>
            <span className="plots-wa-arrow" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
          <div className="plots-disclaimer">
            <p>
              Tentative rate and amount/month from the project plot list. Final
              prices, charges and availability are subject to change without prior
              notice.
            </p>
            <p>
              Plot areas and dimensions from the project plot list. Map shows 87
              residential plots plus commercial; list id 12A is shown on the plan.
              Numbers 74–75 appear in the list but not on the brochure site-plan
              legend. Mortgage marks follow the project plot list.
            </p>
          </div>
        </div>
      </div>

      <div className="plots-disclaimer-mobile sheet">
        <span className="plots-disclaimer-ico" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M14 3v5h5M9 13h6M9 17h6" />
          </svg>
        </span>
        <p>
          Tentative rate and amount/month from the project plot list. Final figures
          subject to change. Map shows 87 residential plots plus commercial (12A on
          plan; 74–75 in list only). Mortgage marks follow the plot list.
        </p>
      </div>

      <dialog className="plot-dialog" id="plotDialog" aria-labelledby="plotDialogTitle">
        <div className="plot-dialog-card">
          <button
            type="button"
            className="plot-dialog-close"
            data-plot-close
            aria-label="Close plot details"
          >
            &times;
          </button>
          <p className="plot-dialog-kicker">Plot details</p>
          <h3 className="plot-dialog-title" id="plotDialogTitle">
            Plot —
          </h3>
          <dl className="plot-dialog-meta" id="plotDialogMeta" />
          <div className="plot-dialog-tags" id="plotDialogTags" />
          <div className="plot-dialog-price" id="plotDialogPrice" />
          <p className="plot-dialog-status" id="plotDialogStatus" />
          <div
            className="cost-calc cost-calc--dialog"
            id="costCalcDialog"
            data-cost-calc="dialog"
            hidden
          />
          <a
            className="plot-dialog-wa"
            id="plotDialogWa"
            href={site.whatsapp}
            rel="noopener noreferrer"
          >
            Enquire about this plot
          </a>
        </div>
      </dialog>
    </section>
  );
}

function BandRow({
  band,
  size,
  label,
  sizeLabel,
  count,
  staticRow,
}: {
  band: string;
  size: string;
  label: React.ReactNode;
  sizeLabel: string;
  count: string;
  staticRow?: boolean;
}) {
  return (
    <tr
      className={`plots-band-row${staticRow ? " plots-band-row--static" : ""}`}
      data-band={band}
      data-size={size}
      tabIndex={0}
      role="button"
      aria-expanded="false"
    >
      <td>{label}</td>
      <td data-band-size>{sizeLabel}</td>
      <td data-band-count>{count}</td>
      <td className="plots-rate" data-size={size}>
        —
      </td>
      <td className="plots-amount-month" data-size={size}>
        —
      </td>
      <td className="plots-table-chevron" aria-hidden="true">
        <span className="plots-chevron" />
      </td>
    </tr>
  );
}
