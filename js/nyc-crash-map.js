/* NYC VRU crash analysis — three independent Leaflet maps, notebook-style
   (one dedicated map + stats panel per analysis, no shared toggle).
   Reads window.CRASH_BIKE_GAPS, window.CRASH_311_OVERLAP, window.CRASH_ZIP_RISK from nyc-crash-data.js. */
(function () {
  "use strict";

  var NUM = function (n, d) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: d || 0 }); };

  function baseMap(id) {
    var map = L.map(id, { scrollWheelZoom: false }).setView([40.72, -73.95], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19, subdomains: "abcd"
    }).addTo(map);
    return map;
  }

  function stat(k, v) {
    return '<div class="stat"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>';
  }

  // ---- Map 1: Bike Lane Gaps ----
  (function () {
    var map = baseMap("map-bike-gaps");
    var feats = window.CRASH_BIKE_GAPS.features;
    var layer = L.geoJSON(window.CRASH_BIKE_GAPS, {
      pointToLayer: function (f, latlng) {
        return L.circleMarker(latlng, { radius: 4, color: "#7a3712", fillColor: "#e08a4f", fillOpacity: 0.7, weight: 1 });
      },
      onEachFeature: function (f, layer) {
        var p = f.properties;
        layer.bindPopup("<strong>" + p.street + "</strong><br>" + NUM(p.dist_m, 0) + "m from nearest bike lane");
      }
    }).addTo(map);
    try { map.fitBounds(layer.getBounds().pad(0.1)); } catch (e) {}

    var byStreet = {};
    feats.forEach(function (f) {
      var s = f.properties.street;
      (byStreet[s] = byStreet[s] || []).push(f.properties.dist_m);
    });
    var rows = Object.keys(byStreet).map(function (s) {
      var ds = byStreet[s];
      var mean = ds.reduce(function (a, b) { return a + b; }, 0) / ds.length;
      return { street: s, count: ds.length, mean: mean };
    }).sort(function (a, b) { return b.count - a.count; });

    var html = '<div class="sc-label">Bike Lane Gaps</div>' +
      '<div class="sc-desc">Accidents more than 100m from the nearest bike lane, by street.</div>';
    rows.forEach(function (r) {
      html += stat(r.street, r.count + " accidents &middot; " + NUM(r.mean, 0) + "m avg gap");
    });
    document.getElementById("stats-bike-gaps").innerHTML = html;
  })();

  // ---- Map 2: 311 Overlap Zones ----
  (function () {
    var map = baseMap("map-311-overlap");
    var colors = {
      "Bike Accident": "#d64545",
      "Blocked Lane 311 Complaint": "#3d6b66",
      "Overlap (Accident + Complaint)": "#c99a3b"
    };
    L.geoJSON(window.CRASH_311_OVERLAP, {
      pointToLayer: function (f, latlng) {
        var isOverlap = f.properties.kind.indexOf("Overlap") === 0;
        return L.circleMarker(latlng, {
          radius: isOverlap ? 6 : 3,
          color: colors[f.properties.kind] || "#999",
          fillColor: colors[f.properties.kind] || "#999",
          fillOpacity: 0.65,
          weight: isOverlap ? 1.5 : 1
        });
      },
      onEachFeature: function (f, layer) {
        layer.bindPopup("<strong>" + f.properties.street + "</strong><br>" + f.properties.kind);
      }
    }).addTo(map);

    // Overlap-zone points are grid-cell based and carry a generic "Multiple"
    // street label in the source data (they can span more than one street),
    // so "top streets" is computed from the individual accident/complaint
    // points instead, which do retain their real street names.
    var byStreet = {};
    window.CRASH_311_OVERLAP.features.forEach(function (f) {
      if (f.properties.kind.indexOf("Overlap") !== 0) {
        var s = f.properties.street;
        byStreet[s] = (byStreet[s] || 0) + 1;
      }
    });
    var topStreets = Object.keys(byStreet)
      .map(function (s) { return { street: s, count: byStreet[s] }; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 8);

    var html = '<div class="sc-label">311 Overlap Zones</div>' +
      '<div class="sc-desc">Where "Blocked Bike Lane" complaints and accidents cluster together.</div>' +
      stat("Correlation (accidents vs. complaints)", "r = 0.43") +
      '<div class="weights">Top streets by combined accident + complaint activity:</div>';
    topStreets.forEach(function (r) {
      html += stat(r.street, r.count + " points");
    });
    document.getElementById("stats-311-overlap").innerHTML = html;
  })();

  // ---- Map 3: High-Risk ZIP Codes ----
  (function () {
    var map = baseMap("map-zip-risk");
    var fillColors = { "robust-high": "#b5541f", "borderline": "#c99a3b", "normal": "#e2ded1" };
    L.geoJSON(window.CRASH_ZIP_RISK, {
      style: function (f) {
        var cat = f.properties.risk_category;
        return {
          color: cat === "normal" ? "#b8b2a0" : "#3b2f26",
          weight: cat === "normal" ? 0.5 : 1.5,
          fillColor: fillColors[cat] || "#e2ded1",
          fillOpacity: cat === "normal" ? 0.15 : 0.6
        };
      },
      onEachFeature: function (f, layer) {
        var p = f.properties;
        layer.bindPopup(
          "<strong>" + p.zipcode + "</strong><br>" +
          (p.risk_category === "normal" ? "Not flagged" : p.risk_category.replace("-", " ")) +
          (p.accident_count ? "<br>" + NUM(p.accident_count, 0) + " accidents" : "")
        );
      }
    }).addTo(map);

    var robust = [], borderline = [];
    window.CRASH_ZIP_RISK.features.forEach(function (f) {
      var p = f.properties;
      if (p.risk_category === "robust-high") robust.push(p);
      else if (p.risk_category === "borderline") borderline.push(p);
    });
    robust.sort(function (a, b) { return (b.accident_count || 0) - (a.accident_count || 0); });
    borderline.sort(function (a, b) { return (b.accident_count || 0) - (a.accident_count || 0); });

    var html = '<div class="sc-label">High-Risk ZIP Codes</div>' +
      '<div class="sc-desc">ZIP codes with disproportionately high bike-accident counts relative to population.</div>' +
      '<div class="weights">Robust across all threshold variants tested:</div>';
    robust.forEach(function (p) { html += stat(p.zipcode, NUM(p.accident_count, 0) + " accidents"); });
    html += '<div class="weights">Borderline (flagged at the original cutoff, but not stable across nearby thresholds):</div>';
    borderline.forEach(function (p) { html += stat(p.zipcode, NUM(p.accident_count, 0) + " accidents"); });
    document.getElementById("stats-zip-risk").innerHTML = html;
  })();
})();
