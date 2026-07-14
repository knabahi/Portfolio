/* ADK SDSS scenario explorer — client-side Leaflet map.
   Reads window.SCENARIOS, window.ADK_BOUNDARY, and window.DEC_LANDS from data.js. */
(function () {
  "use strict";

  // Stakeholder profile metadata. Weight order: Land · Bio · Riparian · Gap · Size · Cost.
  // NOTE: the original 9 stakeholder weight profiles only produced 4 distinct
  // outcomes — several different weightings independently converged on the same
  // parcel/cluster. Consolidated to one button per distinct result, with the
  // description naming which weight profiles land there.
  var META = {
    Same:      { label: "Balanced",          desc: "Equal weights across all criteria — same outcome as prioritizing protection gaps alone.", w: "1·1·1·1·1·1" },
    Bio:       { label: "Ecology-Focused",   desc: "Any strongly ecology-weighted profile (biodiversity, rare habitat, cost-conscious efficiency) converges here.", w: "3·3·3·3·1·1" },
    WildLand:  { label: "Forest & Water",    desc: "Wins under both riparian-focused and wild-forest-focused weighting.", w: "3·1·1·1·1·1" },
    Fiscal:    { label: "Lowest Cost",       desc: "Minimizes cost under a tight $1.5M budget — the one profile with a genuinely different outcome driven by budget alone.", w: "1·1·1·1·1·3" },
    SizeFocus: { label: "Maximize Acreage",  desc: "Prioritizes total acreage over ecological quality — grows a larger, lower-scoring cluster instead of a smaller, higher-quality one.", w: "1·1·1·1·4·1" }
  };
  var ORDER = ["Same", "Bio", "WildLand", "Fiscal", "SizeFocus"];

  // Budget cap varies per scenario; acreage target (2,250-2,750) is the same for all.
  var BUDGET = { Same: "$3M", Bio: "$3M", WildLand: "$3M", Fiscal: "$1.5M", SizeFocus: "$3M" };

  var USD = function (n) { return "$" + Math.round(n).toLocaleString(); };
  var NUM = function (n, d) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: d || 0 }); };

  // group features by scenario
  var byScenario = {};
  window.SCENARIOS.features.forEach(function (f) {
    var s = f.properties.Scenario;
    (byScenario[s] = byScenario[s] || []).push(f);
  });

  var map = L.map("map", { scrollWheelZoom: false }).setView([44.0, -74.4], 7);

  var imagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 19
  });
  var light = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19, subdomains: "abcd"
  });

  imagery.addTo(map); // default basemap

  // ADK boundary for context
  L.geoJSON(window.ADK_BOUNDARY, {
    style: { color: "#2f6b3e", weight: 1.5, fillColor: "#2f6b3e", fillOpacity: 0.05, dashArray: "4 4" },
    interactive: false
  }).addTo(map);

  // Existing NYS DEC-owned land, undissolved (individual units) so you can see exactly
  // which DEC parcel a candidate borders. Off by default — it's a lot of polygons and
  // competes visually with the highlighted results if left on.
  var decLands = L.geoJSON(window.DEC_LANDS, {
    style: { color: "#1b5e3a", weight: 1, fillColor: "#4f9d6e", fillOpacity: 0.35 },
    onEachFeature: function (f, layer) {
      var p = f.properties;
      layer.bindPopup(
        "<strong>" + (p.FACILITY || p.UMP || "DEC Land") + "</strong><br>" +
        (p.UMP ? p.UMP + "<br>" : "") +
        (p.CATEGORY || p.CLASS || "") + "<br>" +
        "<span style='color:#5c6b63'>" + (p.COUNTY || "") +
        (p.ACRES ? " Co. &middot; " + NUM(p.ACRES, 1) + " acres" : " Co.") + "</span>"
      );
    }
  });

  L.control.layers({ "Imagery": imagery, "Light": light }, { "DEC Lands": decLands },
                   { position: "topright", collapsed: false }).addTo(map);

  var currentLayer = null;

  function parcelPopup(p) {
    return "<strong>" + (p.CITYTOWN_NAME || "Parcel") + "</strong>, " + (p.COUNTY_NAME || "") + " Co.<br>" +
           NUM(p.ACRES, 1) + " acres &middot; " + USD(p.FULL_MARKET_VAL) + "<br>" +
           "<span style='color:#5c6b63'>Class " + (p.PROP_CLASS || "?") +
           (p.PRIMARY_OWNER ? " &middot; " + p.PRIMARY_OWNER : "") + "</span>";
  }

  function showScenario(name) {
    if (currentLayer) { map.removeLayer(currentLayer); }
    var feats = byScenario[name] || [];
    currentLayer = L.geoJSON({ type: "FeatureCollection", features: feats }, {
      style: { color: "#ffffff", weight: 2, fillColor: "#d9a441", fillOpacity: 0.6 },
      onEachFeature: function (f, layer) {
        layer.bindPopup(parcelPopup(f.properties));
        layer.on("mouseover", function () { layer.setStyle({ fillOpacity: 0.8 }); });
        layer.on("mouseout", function () { layer.setStyle({ fillOpacity: 0.55 }); });
      }
    }).addTo(map);
    try { map.fitBounds(currentLayer.getBounds().pad(0.4)); } catch (e) {}

    // info panel (cluster-level stats are identical across a scenario's rows)
    var p = feats[0].properties, m = META[name] || { label: name, desc: "", w: "" };
    document.getElementById("infoPanel").innerHTML =
      '<div class="sc-label">' + m.label + '</div>' +
      '<div class="sc-desc">' + m.desc + '</div>' +
      stat("Location", p.CITYTOWN_NAME + ", " + p.COUNTY_NAME + " Co.") +
      stat("Parcels", p.N_Parcels) +
      stat("Total acres", NUM(p.Cluster_Acres, 1)) +
      stat("Total price", USD(p.Cluster_Value)) +
      stat("Suitability index", NUM(p.Final_Index, 2)) +
      '<div class="weights">Weights (Land·Bio·Rip·Gap·Size·Cost): <code>' + m.w + '</code></div>' +
      '<div class="weights">Budget cap <code>' + (BUDGET[name] || "") + '</code> &middot; target <code>2,250–2,750 ac</code> (same for every scenario)</div>';

    Array.prototype.forEach.call(document.querySelectorAll(".scenario-btns button"), function (b) {
      b.classList.toggle("active", b.dataset.s === name);
    });
  }

  function stat(k, v) {
    return '<div class="stat"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>';
  }

  // build scenario buttons
  var wrap = document.getElementById("scenarioBtns");
  ORDER.forEach(function (name) {
    if (!byScenario[name]) return;
    var b = document.createElement("button");
    b.textContent = (META[name] || {}).label || name;
    b.dataset.s = name;
    b.onclick = function () { showScenario(name); };
    wrap.appendChild(b);
  });

  showScenario("Same");
})();
