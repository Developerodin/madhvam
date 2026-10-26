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

    function formatInr(value, digits) {
      if (value == null || isNaN(value)) return null;
      var maxDigits = digits == null ? 0 : digits;
      try {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: (data.pricing && data.pricing.currency) || "INR",
          maximumFractionDigits: maxDigits,
          minimumFractionDigits: maxDigits > 0 && value % 1 !== 0 ? Math.min(2, maxDigits) : 0
        }).format(value);
      } catch (err) {
        return "₹" + Number(value).toLocaleString("en-IN", {
          maximumFractionDigits: maxDigits
        });
      }
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

    function tentativeForPlot(plot) {
      var rate = plot && plot.ratePerSqYd != null
        ? plot.ratePerSqYd
        : (data.pricing && data.pricing.ratePerSqYd);
      var amount = plot && plot.amountMonth != null
        ? plot.amountMonth
        : (rate != null && plot && plot.sizeSqYd != null ? rate * plot.sizeSqYd : null);
      if (rate == null || rate === "") {
        return {
          rateLabel: (data.pricing && data.pricing.priceLabel) || "On request",
          amountLabel: (data.pricing && data.pricing.priceLabel) || "On request",
          rate: null,
          amountMonth: null
        };
      }
      return {
        rateLabel: formatInr(rate, 2),
        amountLabel: amount != null ? formatInr(amount, 2) : "—",
        rate: rate,
        amountMonth: amount
      };
    }

    function tentativeForSize(sizeSqYd) {
      return tentativeForPlot({ sizeSqYd: sizeSqYd, ratePerSqYd: data.pricing && data.pricing.ratePerSqYd });
    }

    function calcConfig() {
      return data.costCalculator || {};
    }

    function moneyOrPending(value) {
      if (value == null || value === "" || isNaN(value)) return { label: "To be advised", value: null };
      return { label: formatInr(value, 0), value: Number(value) };
    }

    function estimateForPlot(plot) {
      var cfg = calcConfig();
      var rate = cfg.landRatePerSqYd != null
        ? cfg.landRatePerSqYd
        : (plot && plot.ratePerSqYd != null
          ? plot.ratePerSqYd
          : (data.pricing && data.pricing.ratePerSqYd));
      var areaYd = plot && plot.sizeSqYd != null ? Number(plot.sizeSqYd) : null;
      var areaFt = plot && plot.sizeSqFt != null
        ? Number(plot.sizeSqFt)
        : (areaYd != null ? Math.round(areaYd * 9) : null);
      var builtUpRatio = cfg.builtUpRatio != null ? Number(cfg.builtUpRatio) : 1;
      var builtUpFt = areaFt != null ? areaFt * builtUpRatio : null;

      var landCost = rate != null && areaYd != null ? rate * areaYd : null;
      var registryPct = cfg.registryPct != null ? Number(cfg.registryPct) : null;
      var otherPct = cfg.otherChargesPct != null ? Number(cfg.otherChargesPct) : null;
      var registry = landCost != null && registryPct != null ? landCost * (registryPct / 100) : null;
      var otherCharges = landCost != null && otherPct != null ? landCost * (otherPct / 100) : null;
      var club = cfg.clubCharge;
      var development = cfg.developmentCharge;
      var maintenance = cfg.maintenanceCharge;
      var constructionRate = cfg.constructionRatePerSqFt;
      var construction = constructionRate != null && builtUpFt != null
        ? Number(constructionRate) * builtUpFt
        : null;

      var parts = [landCost, registry, otherCharges, club, development, maintenance, construction];
      var total = 0;
      var hasTotal = false;
      parts.forEach(function (part) {
        if (part != null && !isNaN(part)) {
          total += Number(part);
          hasTotal = true;
        }
      });

      return {
        plot: plot,
        rate: rate,
        areaYd: areaYd,
        areaFt: areaFt,
        builtUpFt: builtUpFt,
        landCost: landCost,
        registryPct: registryPct,
        registry: registry,
        otherPct: otherPct,
        otherCharges: otherCharges,
        club: club,
        development: development,
        maintenance: maintenance,
        constructionRate: constructionRate,
        construction: construction,
        total: hasTotal ? total : null,
        disclaimer: cfg.disclaimer ||
          "Indicative estimate only. Final charges as per Builder-Buyer Agreement."
      };
    }

    function estimateRowsHtml(est) {
      function row(label, detail, amount) {
        var money = moneyOrPending(amount);
        var detailHtml = detail
          ? '<span class="cost-calc-detail">' + detail + "</span>"
          : "";
        return (
          '<div class="cost-calc-row">' +
            '<div class="cost-calc-row-label"><span>' + label + "</span>" + detailHtml + "</div>" +
            '<div class="cost-calc-row-value">' + money.label + "</div>" +
          "</div>"
        );
      }

      var landDetail = est.rate != null && est.areaYd != null
        ? formatInr(est.rate, 2) + " × " + formatArea(est.areaYd) + " sq yd"
        : "";
      var registryDetail = est.registryPct != null ? est.registryPct + "% of land cost" : "";
      var otherDetail = est.otherPct != null ? est.otherPct + "% of land cost" : "";
      var constructionDetail = est.constructionRate != null && est.builtUpFt != null
        ? formatInr(est.constructionRate, 0) + " × " + formatArea(est.builtUpFt, 0) + " sq ft"
        : "Rate to be advised";

      return (
        row("Land cost", landDetail, est.landCost) +
        row("Registry &amp; stamp duty", registryDetail, est.registry) +
        row("Other charges", otherDetail, est.otherCharges) +
        row("Club charges", "Placeholder — to be supplied", est.club) +
        row("Development charges", "Placeholder — to be supplied", est.development) +
        row("Maintenance charges", "Placeholder — to be supplied", est.maintenance) +
        row("Approx. construction cost", constructionDetail, est.construction) +
        '<div class="cost-calc-row cost-calc-row--total">' +
          '<div class="cost-calc-row-label"><span>Total estimated cost</span>' +
            '<span class="cost-calc-detail">Owning a built home (indicative)</span></div>' +
          '<div class="cost-calc-row-value">' + moneyOrPending(est.total).label + "</div>" +
        "</div>"
      );
    }

    function estimateFormHtml(formId) {
      return (
        '<p class="cost-calc-disclaimer">' +
          (calcConfig().disclaimer ||
            "Indicative estimate only. Final charges as per Builder-Buyer Agreement.") +
        "</p>" +
        '<form class="cost-calc-wa-form" id="' + formId + '" novalidate>' +
          '<p class="cost-calc-wa-title">Get this estimate on WhatsApp</p>' +
          '<label class="cost-calc-field">' +
            '<span class="cost-calc-label">Name</span>' +
            '<input type="text" name="name" autocomplete="name" required placeholder="Your name" />' +
          "</label>" +
          '<label class="cost-calc-field">' +
            '<span class="cost-calc-label">Phone</span>' +
            '<input type="tel" name="phone" autocomplete="tel" required placeholder="10-digit mobile" inputmode="numeric" maxlength="14" />' +
          "</label>" +
          '<button type="submit" class="cost-calc-wa-btn">Get this estimate on WhatsApp</button>' +
        "</form>"
      );
    }

    function renderEstimateBody(container, plot, formId, opts) {
      if (!container || !plot) return null;
      var est = estimateForPlot(plot);
      var label = plotLabel(plot);
      var withTitle = opts && opts.showTitle;
      container.hidden = false;
      container.innerHTML =
        (withTitle
          ? '<p class="cost-calc-kicker">Estimate</p><h4 class="cost-calc-title">Cost calculator</h4>'
          : "") +
        '<p class="cost-calc-summary">Plot <strong>' + label + "</strong> · " +
          formatArea(est.areaYd) + " sq yd · Tentative land rate " +
          (est.rate != null ? formatInr(est.rate, 2) : "—") + "/sq yd</p>" +
        '<div class="cost-calc-rows">' + estimateRowsHtml(est) + "</div>" +
        estimateFormHtml(formId);
      bindEstimateForm(container.querySelector("#" + formId), plot, est);
      return est;
    }

    function estimateWhatsAppMessage(plot, est, name, phone) {
      var label = plot.isCommercial ? "Commercial plot" : ("Plot " + plotLabel(plot));
      var lines = [
        "Hi, I'd like this Madhavam cost estimate on WhatsApp.",
        "Name: " + name,
        "Phone: " + phone,
        label + (est.areaYd != null ? (" · " + formatArea(est.areaYd) + " sq yd") : ""),
        "Land cost: " + moneyOrPending(est.landCost).label,
        "Registry (" + (est.registryPct != null ? est.registryPct + "%" : "—") + "): " +
          moneyOrPending(est.registry).label,
        "Other (" + (est.otherPct != null ? est.otherPct + "%" : "—") + "): " +
          moneyOrPending(est.otherCharges).label,
        "Club: " + moneyOrPending(est.club).label,
        "Development: " + moneyOrPending(est.development).label,
        "Maintenance: " + moneyOrPending(est.maintenance).label,
        "Construction: " + moneyOrPending(est.construction).label,
        "Total (indicative): " + moneyOrPending(est.total).label,
        "Note: Indicative estimate only. Final charges as per Builder-Buyer Agreement."
      ];
      return lines.join("\n");
    }

    function bindEstimateForm(form, plot, est) {
      if (!form) return;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var nameInput = form.querySelector('[name="name"]');
        var phoneInput = form.querySelector('[name="phone"]');
        var name = nameInput ? String(nameInput.value || "").trim() : "";
        var phone = phoneInput ? String(phoneInput.value || "").trim() : "";
        if (!name) {
          if (nameInput) nameInput.focus();
          return;
        }
        if (!phone || phone.replace(/\D/g, "").length < 10) {
          if (phoneInput) phoneInput.focus();
          return;
        }
        var url = WA_BASE + "?text=" + encodeURIComponent(
          estimateWhatsAppMessage(plot, est, name, phone)
        );
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    var costCalcDd = {
      root: document.getElementById("costCalcDropdown"),
      trigger: document.getElementById("costCalcPlotSelect"),
      valueEl: document.getElementById("costCalcPlotValue"),
      list: document.getElementById("costCalcPlotList"),
      value: ""
    };

    function setCalcOpen(open) {
      var top = section.querySelector(".plots-top");
      if (!top) return;
      top.classList.toggle("is-calc-open", Boolean(open));
    }

    function setCostCalcDdOpen(open) {
      if (!costCalcDd.root || !costCalcDd.trigger || !costCalcDd.list) return;
      costCalcDd.root.classList.toggle("is-open", Boolean(open));
      costCalcDd.trigger.setAttribute("aria-expanded", open ? "true" : "false");
      costCalcDd.list.hidden = !open;
    }

    function setCostCalcDdValue(value, label, silent) {
      costCalcDd.value = value || "";
      if (costCalcDd.valueEl) {
        costCalcDd.valueEl.textContent = label || "Select a plot";
      }
      if (costCalcDd.list) {
        costCalcDd.list.querySelectorAll('[role="option"]').forEach(function (opt) {
          var on = opt.getAttribute("data-value") === costCalcDd.value;
          opt.setAttribute("aria-selected", on ? "true" : "false");
          opt.classList.toggle("is-selected", on);
        });
      }
      if (!silent) {
        if (!costCalcDd.value) syncPageCostCalc(null);
        else {
          var plot = costCalcDd.value === "commercial"
            ? plotByNumber.commercial
            : plotByNumber[Number(costCalcDd.value)];
          if (plot) syncPageCostCalc(plot);
        }
      }
    }

    function populateCostCalcSelect() {
      if (!costCalcDd.list) return;
      var current = costCalcDd.value;
      costCalcDd.list.replaceChildren();

      function addOption(value, label) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        li.setAttribute("data-value", value);
        li.setAttribute("tabindex", "-1");
        li.textContent = label;
        li.addEventListener("click", function () {
          setCostCalcDdValue(value, label, false);
          setCostCalcDdOpen(false);
          if (costCalcDd.trigger) costCalcDd.trigger.focus();
        });
        costCalcDd.list.appendChild(li);
      }

      addOption("", "Select a plot");
      (data.plots || []).forEach(function (plot) {
        addOption(
          String(plot.number),
          "Plot " + plotLabel(plot) + " · " + formatArea(plot.sizeSqYd) + " sq yd"
        );
      });
      if (data.commercial) {
        addOption(
          "commercial",
          "Commercial · " + formatArea(data.commercial.sizeSqYd) + " sq yd"
        );
      }

      if (current) {
        var match = costCalcDd.list.querySelector('[data-value="' + current + '"]');
        setCostCalcDdValue(current, match ? match.textContent : "Select a plot", true);
      } else {
        setCostCalcDdValue("", "Select a plot", true);
      }
    }

    function syncPageCostCalc(plot) {
      var body = document.getElementById("costCalcPageBody");
      if (!body) return;
      if (!plot) {
        body.hidden = true;
        body.innerHTML = "";
        setCostCalcDdValue("", "Select a plot", true);
        setCalcOpen(false);
        return;
      }
      var key = plot.isCommercial ? "commercial" : String(plot.number);
      var label = plot.isCommercial
        ? ("Commercial · " + formatArea(plot.sizeSqYd) + " sq yd")
        : ("Plot " + plotLabel(plot) + " · " + formatArea(plot.sizeSqYd) + " sq yd");
      setCostCalcDdValue(key, label, true);
      renderEstimateBody(body, plot, "costCalcPageWaForm");
      setCalcOpen(true);
    }

    function hydratePrices() {
      section.querySelectorAll(".plots-rate").forEach(function (cell) {
        var size = Number(cell.getAttribute("data-size"));
        cell.textContent = tentativeForSize(size).rateLabel;
      });
      section.querySelectorAll(".plots-amount-month").forEach(function (cell) {
        var size = Number(cell.getAttribute("data-size"));
        var priced = tentativeForSize(size);
        cell.textContent = priced.amountLabel;
      });
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
      var priced = tentativeForPlot(plot);
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
        price.innerHTML =
          "<span>Tentative rate (per sq yd)</span><strong>" + priced.rateLabel + "</strong>" +
          "<span style=\"display:block;margin-top:0.55rem\">Amount / month (as per list)</span><strong>" +
          priced.amountLabel + "</strong>";
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

      var dialogCalc = document.getElementById("costCalcDialog");
      if (dialogCalc && calcConfig().enabled !== false) {
        dialogCalc.hidden = false;
        renderEstimateBody(dialogCalc, plot, "costCalcDialogWaForm", { showTitle: true });
      } else if (dialogCalc) {
        dialogCalc.hidden = true;
        dialogCalc.innerHTML = "";
      }
      syncPageCostCalc(plot);

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

    hydratePrices();
    hydrateBandTable();
    populateCostCalcSelect();
    renderMap();

    if (costCalcDd.trigger && costCalcDd.root) {
      costCalcDd.trigger.addEventListener("click", function () {
        setCostCalcDdOpen(!costCalcDd.root.classList.contains("is-open"));
      });
      costCalcDd.trigger.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setCostCalcDdOpen(true);
          var first = costCalcDd.list && costCalcDd.list.querySelector('[role="option"]');
          if (first) first.focus();
        } else if (event.key === "Escape") {
          setCostCalcDdOpen(false);
        }
      });
      if (costCalcDd.list) {
        costCalcDd.list.addEventListener("keydown", function (event) {
          var options = Array.prototype.slice.call(
            costCalcDd.list.querySelectorAll('[role="option"]')
          );
          var index = options.indexOf(document.activeElement);
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (options[index + 1]) options[index + 1].focus();
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (options[index - 1]) options[index - 1].focus();
            else if (costCalcDd.trigger) costCalcDd.trigger.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (document.activeElement && document.activeElement.click) {
              document.activeElement.click();
            }
          } else if (event.key === "Escape") {
            setCostCalcDdOpen(false);
            if (costCalcDd.trigger) costCalcDd.trigger.focus();
          }
        });
      }
      document.addEventListener("click", function (event) {
        if (!costCalcDd.root.contains(event.target)) setCostCalcDdOpen(false);
      });
    }

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
