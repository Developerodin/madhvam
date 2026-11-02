/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any, prefer-const, no-var */
// @ts-nocheck
/** Port of plots interaction from js/main.js — same DOM behavior. */
export function initPlots(root: HTMLElement, plotsData: any): () => void {

    var data = plotsData;
    var section = root;
    if (!data || !section) return function cleanup() {};

    var svg = document.getElementById("plotsMapSvg");
    var dialog = document.getElementById("plotDialog");
    var chipsEl = document.getElementById("plotsBandChips");
    var bandRows = section.querySelectorAll(".plots-band-row");
    var NS = "http://www.w3.org/2000/svg";
    var WA_BASE = "https://wa.me/919319976589";
    var activeBand = null;
    var plotByNumber = {};

    (data.plots || []).forEach(function (plot) {
      plotByNumber[plot.number] = plot;
    });
    if (data.commercial) {
      data.commercial.isCommercial = true;
      data.commercial.number = data.commercial.number || "commercial";
      plotByNumber.commercial = data.commercial;
    }

    function padPlot(n) {
      if (typeof n === "string") return n;
      return n < 10 ? "0" + n : String(n);
    }

    function plotLabel(plot) {
      if (!plot) return "—";
      if (plot.displayNumber) return String(plot.displayNumber);
      if (plot.isCommercial) return "Commercial";
      return padPlot(plot.number);
    }

    function formatArea(value, digits) {
      if (value == null || isNaN(value)) return "—";
      return Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: digits == null ? 2 : digits,
        minimumFractionDigits: 0
      });
    }

    function statusClass(status, plot) {
      var s = (status || "Available").toLowerCase();
      var classes = [];
      if (s === "sold") classes.push("is-sold");
      else if (s === "booked") classes.push("is-booked");
      else classes.push("is-available");
      if (plot && plot.mortgage) classes.push("is-mortgage");
      return classes.join(" ");
    }

    function hydrateBandTable() {
      (data.bands || []).forEach(function (band) {
        var row = section.querySelector('.plots-band-row[data-band="' + band.bandKey + '"]');
        if (!row) return;
        var sizeCell = row.querySelector("[data-band-size]");
        if (sizeCell && band.sizeSqYdLabel) {
          sizeCell.textContent = band.sizeSqYdLabel;
        }
        var countCell = row.querySelector("[data-band-count]");
        if (countCell && band.count != null) {
          countCell.textContent = String(band.count);
        }
      });
      var totalEl = section.querySelector(".plots-total strong");
      if (totalEl) totalEl.textContent = String((data.plots || []).length);
    }

    function el(name, attrs, text) {
      var node = document.createElementNS(NS, name);
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          node.setAttribute(key, attrs[key]);
        });
      }
      if (text != null) node.textContent = text;
      return node;
    }

    function bandFill(bandKey) {
      if (data.bandColors && data.bandColors[bandKey]) return data.bandColors[bandKey];
      var band = (data.bands || []).find(function (b) { return b.bandKey === bandKey; });
      return (band && band.color) || "#d8d0c4";
    }

    function renderMap() {
      if (!svg) return;
      var vb = data.viewBox || { width: 394, height: 849 };
      svg.setAttribute("viewBox", "0 0 " + vb.width + " " + vb.height);
      svg.replaceChildren();

      var bg = el("g", { class: "plot-backdrop", "aria-hidden": "true" });
      bg.appendChild(el("rect", {
        class: "plot-ground",
        x: 0,
        y: 0,
        width: vb.width,
        height: vb.height,
        rx: 10
      }));

      var voidRect = data.amenitiesVoid;
      if (voidRect) {
        bg.appendChild(el("rect", {
          class: "plot-amenities-void",
          x: voidRect.x,
          y: voidRect.y,
          width: voidRect.w,
          height: voidRect.h,
          rx: 4
        }));
      }

      (data.roads || []).forEach(function (road) {
        bg.appendChild(el("rect", {
          class: "plot-road",
          x: road.x,
          y: road.y,
          width: road.w,
          height: road.h,
          rx: 3
        }));
      });
      svg.appendChild(bg);

      var commercial = data.commercial;
      if (commercial && commercial.rect) {
        var cr = commercial.rect;
        var clickable = commercial.clickable !== false;
        var cgAttrs = {
          class: "plot plot-commercial " + statusClass(commercial.status || "Available", commercial) +
            (clickable ? " is-clickable" : ""),
          "data-plot": "commercial",
          "data-band": "commercial",
          "aria-label": [
            "Commercial plot",
            commercial.sizeSqYd ? commercial.sizeSqYd + " sq yd" : "",
            commercial.status || "Available"
          ].filter(Boolean).join(", ")
        };
        if (clickable) {
          cgAttrs.role = "button";
          cgAttrs.tabindex = "0";
        } else {
          cgAttrs["aria-hidden"] = "true";
        }
        var cg = el("g", cgAttrs);
        cg.appendChild(el("rect", {
          x: cr.x,
          y: cr.y,
          width: cr.w,
          height: cr.h,
          rx: 3
        }));
        var cSize = Math.max(8, Math.min(12, cr.w * 0.12));
        var cLabel = el("text", {
          x: cr.x + cr.w / 2,
          y: cr.y + cr.h / 2 - cSize * 0.55,
          "text-anchor": "middle",
          "dominant-baseline": "central",
          "font-size": String(cSize)
        });
        cLabel.appendChild(el("tspan", {
          x: cr.x + cr.w / 2,
          dy: "0"
        }, "COMMERCIAL"));
        cLabel.appendChild(el("tspan", {
          x: cr.x + cr.w / 2,
          dy: String(cSize * 1.25)
        }, "PLOT"));
        cg.appendChild(cLabel);
        svg.appendChild(cg);
      }

      var layer = el("g", { class: "plot-tiles" });
      (data.plots || []).forEach(function (plot) {
        var r = plot.rect || {};
        var status = plot.status || "Available";
        var labelText = plotLabel(plot);
        var cx = r.x + r.w / 2;
        var cy = r.y + r.h / 2;
        var badgeR = Math.max(5.5, Math.min(9, Math.min(r.w, r.h) * 0.32));
        var fontSize = Math.max(5.5, Math.min(10, badgeR * (labelText.length > 2 ? 0.85 : 1.05)));
        var g = el("g", {
          class: "plot " + statusClass(status, plot),
          role: "button",
          tabindex: "0",
          "data-plot": String(plot.number),
          "data-band": plot.bandKey || "",
          "aria-label": [
            "Plot " + labelText,
            plot.sizeSqYd + " sq yd",
            plot.dimensions ? plot.dimensions : "",
            plot.facing ? plot.facing + " facing" : "",
            plot.mortgage ? "Mortgage" : "",
            (plot.tags || []).join(", "),
            status
          ].filter(Boolean).join(", ")
        });
        var tile = el("rect", {
          x: r.x,
          y: r.y,
          width: r.w,
          height: r.h,
          rx: 1.5
        });
        tile.setAttribute("fill", bandFill(plot.bandKey));
        g.appendChild(tile);
        if (plot.mortgage) {
          g.appendChild(el("rect", {
            class: "plot-mortgage-mark",
            x: r.x + 1.2,
            y: r.y + 1.2,
            width: Math.max(3, r.w * 0.18),
            height: Math.max(3, r.h * 0.18),
            rx: 0.6
          }));
        }
        g.appendChild(el("circle", {
          class: "plot-badge",
          cx: cx,
          cy: cy,
          r: badgeR
        }));
        var label = el("text", {
          x: cx,
          y: cy,
          "text-anchor": "middle",
          "dominant-baseline": "central"
        }, labelText);
        label.setAttribute("font-size", String(fontSize));
        g.appendChild(label);
        layer.appendChild(g);
      });
      svg.appendChild(layer);
    }

    function waUrlForPlot(plot) {
      var name = plot.isCommercial ? "the commercial plot" : ("Plot " + plotLabel(plot));
      var sizeBit = plot.sizeSqYd != null ? " (" + plot.sizeSqYd + " sq yd)" : "";
      var msg = "Hi, I'd like details on " + name + sizeBit +
        " at Madhavam, Raj Nagar Extension.";
      return WA_BASE + "?text=" + encodeURIComponent(msg);
    }

    function openPlotDialog(plot) {
      if (!dialog || !plot) return;
      var title = document.getElementById("plotDialogTitle");
      var meta = document.getElementById("plotDialogMeta");
      var tags = document.getElementById("plotDialogTags");
      var price = document.getElementById("plotDialogPrice");
      var statusEl = document.getElementById("plotDialogStatus");
      var wa = document.getElementById("plotDialogWa");
      var label = plotLabel(plot);

      if (title) {
        title.textContent = plot.isCommercial ? "Commercial Plot" : ("Plot " + label);
      }
      if (meta) {
        var rows = [];
        if (!plot.isCommercial) {
          rows.push("<dt>Plot No</dt><dd>" + label + "</dd>");
        }
        if (plot.dimensions) {
          rows.push("<dt>Size (L × B)</dt><dd>" + plot.dimensions + " <span>(m)</span></dd>");
        }
        rows.push("<dt>Area (sq m)</dt><dd>" + formatArea(plot.sizeSqM) + "</dd>");
        rows.push("<dt>Area (sq yd)</dt><dd>" + formatArea(plot.sizeSqYd) + "</dd>");
        if (plot.sizeSqFt != null) {
          rows.push("<dt>Area (sq ft)</dt><dd>" + formatArea(plot.sizeSqFt, 0) + "</dd>");
        }
        if (!plot.isCommercial) {
          rows.push("<dt>Facing</dt><dd>" + (plot.facing || "Confirm at enquiry") + "</dd>");
        }
        if (plot.bandKey && plot.bandKey !== "commercial") {
          rows.push("<dt>Size band</dt><dd>" + plot.bandKey.replace("-", " – ") + "</dd>");
        }
        if (plot.mortgage) {
          rows.push("<dt>List note</dt><dd>Plots being sent for mortgage</dd>");
        }
        meta.innerHTML = rows.join("");
      }
      if (tags) {
        var tagList = (plot.tags || []).slice();
        if (plot.isCommercial) tagList = ["commercial"].concat(tagList);
        if (plot.displayNumber) tagList = ["list id " + plot.displayNumber].concat(tagList);
        tags.innerHTML = tagList.map(function (tag) {
          return '<span class="plot-tag">' + String(tag).replace(/-/g, " ") + "</span>";
        }).join("");
      }
      if (price) {
        // Public site no longer surfaces tentative rate / amount-month
        price.replaceChildren();
        price.hidden = true;
      }
      if (statusEl) {
        var statusText = plot.status || "Available";
        if (plot.mortgage) statusText += " · Mortgage";
        statusEl.textContent = "Status: " + statusText;
        statusEl.setAttribute("data-status", plot.status || "Available");
      }
      if (wa) {
        wa.href = waUrlForPlot(plot);
        wa.textContent = plot.isCommercial
          ? "Enquire about commercial plot"
          : "Enquire about this plot";
      }

      section.querySelectorAll(".plot.is-active").forEach(function (node) {
        node.classList.remove("is-active");
      });
      var selector = plot.isCommercial
        ? '.plot[data-plot="commercial"]'
        : '.plot[data-plot="' + plot.number + '"]';
      var tile = svg && svg.querySelector(selector);
      if (tile) tile.classList.add("is-active");

      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    function closePlotDialog() {
      if (!dialog) return;
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      section.querySelectorAll(".plot.is-active").forEach(function (node) {
        node.classList.remove("is-active");
      });
    }

    function setBandHighlight(bandKey) {
      activeBand = bandKey;
      if (!svg) return;
      svg.querySelectorAll(".plot").forEach(function (node) {
        var match = !bandKey || node.getAttribute("data-band") === bandKey;
        node.classList.toggle("is-band-dim", Boolean(bandKey) && !match);
        node.classList.toggle("is-band-hot", Boolean(bandKey) && match);
      });
      bandRows.forEach(function (row) {
        var on = row.getAttribute("data-band") === bandKey;
        row.classList.toggle("is-active", on);
        row.setAttribute("aria-expanded", on ? "true" : "false");
      });
    }

    function showBandChips(bandKey) {
      if (!chipsEl) return;
      if (!bandKey) {
        chipsEl.hidden = true;
        chipsEl.replaceChildren();
        return;
      }
      var plots = (data.plots || []).filter(function (p) { return p.bandKey === bandKey; });
      if (bandKey === "commercial" && data.commercial) {
        plots = [data.commercial];
      }
      chipsEl.replaceChildren();
      plots.forEach(function (plot) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "plots-chip " + statusClass(plot.status, plot);
        btn.textContent = plot.isCommercial ? "Commercial" : plotLabel(plot);
        btn.setAttribute(
          "aria-label",
          plot.isCommercial ? "Open commercial plot" : ("Open plot " + plotLabel(plot))
        );
        btn.addEventListener("click", function () {
          openPlotDialog(plot);
        });
        chipsEl.appendChild(btn);
      });
      chipsEl.hidden = false;
    }

    function toggleBand(bandKey) {
      if (activeBand === bandKey) {
        setBandHighlight(null);
        showBandChips(null);
        return;
      }
      setBandHighlight(bandKey);
      showBandChips(bandKey);
      if (bandKey === "commercial" && data.commercial) {
        openPlotDialog(data.commercial);
      }
    }

    function plotFromTile(tile) {
      if (!tile) return null;
      var key = tile.getAttribute("data-plot");
      if (key === "commercial") return plotByNumber.commercial;
      return plotByNumber[Number(key)];
    }

    hydrateBandTable();
    renderMap();

    if (svg) {
      svg.addEventListener("click", function (event) {
        var tile = event.target.closest(".plot");
        if (!tile || !svg.contains(tile)) return;
        if (tile.classList.contains("plot-commercial") &&
            !tile.classList.contains("is-clickable")) return;
        var plot = plotFromTile(tile);
        if (plot) {
          /* Clear band dim so map colours stay full when opening a plot */
          setBandHighlight(null);
          showBandChips(null);
          openPlotDialog(plot);
        }
      });
      svg.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        var tile = event.target.closest(".plot");
        if (!tile || !svg.contains(tile)) return;
        if (tile.classList.contains("plot-commercial") &&
            !tile.classList.contains("is-clickable")) return;
        event.preventDefault();
        var plot = plotFromTile(tile);
        if (plot) {
          setBandHighlight(null);
          showBandChips(null);
          openPlotDialog(plot);
        }
      });
    }

    bandRows.forEach(function (row) {
      function activate() {
        toggleBand(row.getAttribute("data-band"));
      }
      row.addEventListener("click", activate);
      row.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });

    if (dialog) {
      dialog.querySelectorAll("[data-plot-close]").forEach(function (btn) {
        btn.addEventListener("click", closePlotDialog);
      });
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) closePlotDialog();
      });
      dialog.addEventListener("cancel", function (event) {
        event.preventDefault();
        closePlotDialog();
      });
    }

  return function cleanup() {};
}
