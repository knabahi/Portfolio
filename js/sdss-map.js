/* ADK SDSS scenario explorer — client-side Leaflet map.
   Reads window.SCENARIOS and window.ADK_BOUNDARY from data.js. */
(function () {
  "use strict";

  // Stakeholder profile metadata. Weight order: Land · Bio · Riparian · Gap · Size · Cost.
  var META = {
    Same:         { label: "Baseline (Equal)",   desc: "All six criteria weighted equally — a neutral starting point.", w: "1·1·1·1·1·1" },
    Bio:          { label: "Biodiversity",        desc: "Heavy weight on every ecological factor.",                       w: "3·3·3·3·1·1" },
    EDGE:         { label: "Rare Habitat (EDGE)", desc: "Prioritizes rare, high-quality habitat and protection gaps.",    w: "1·3·1·3·1·1" },
    River:        { label: "Riparian",            desc: "Prioritizes proximity to rivers and lakes.",                     w: "1·1·3·1·1·1" },
    Fiscal:       { label: "Fiscal",              desc: "Minimizes cost under a tight $1.5M budget.",                     w: "1·1·1·1·1·3" },
    WildLand:     { label: "Wild Forest",         desc: "Prioritizes forested land suitability.",                        w: "3·1·1·1·1·1" },
    Climate:      { label: "Climate Resilience",  desc: "Emphasizes forest land and riparian connectivity.",             w: "3·1·3·1·1·1" },
    GapFocus:     { label: "Protection Gaps",     desc: "Prioritizes under-protected habitat (gap analysis).",           w: "1·1·1·3·1·1" },
    Compromise:   { label: "Compromise",          desc: "Balanced ecology, kept cost-aware.",                            w: "2·2·2·2·1·3" },
    EcoEfficient: { label: "Eco-Efficient",       desc: "Best ecology per dollar: high habitat value, cost-conscious.",  w: "3·3·3·3·1·4" }
  };
  var ORDER = ["Same", "Bio", "EDGE", "River", "GapFocus", "WildLand", "Climate", "Fiscal", "Compromise", "EcoEfficient"];

  var USD = function (n) { return "$" + Math.round(n).toLocaleString(); };
  var NUM = function (n, d) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: d || 0 }); };

  // group features by scenario
  var byScenario = {};
  window.SCENARIOS.features.forEach(function (f) {
    var s = f.properties.Scenario;
    (byScenario[s] = byScenario[s] || []).push(f);
  });

  var map = L.map("map", { scrollWheelZoom: false }).setView([44.0, -74.4], 7);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19, subdomains: "abcd"
  }).addTo(map);

  // ADK boundary for context
  L.geoJSON(window.ADK_BOUNDARY, {
    style: { color: "#2f6b3e", weight: 1.5, fillColor: "#2f6b3e", fillOpacity: 0.05, dashArray: "4 4" },
    interactive: false
  }).addTo(map);

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
      style: { color: "#234f2e", weight: 1.5, fillColor: "#d9a441", fillOpacity: 0.55 },
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
      '<div class="weights">Weights (Land·Bio·Rip·Gap·Size·Cost): <code>' + m.w + '</code></div>';

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
