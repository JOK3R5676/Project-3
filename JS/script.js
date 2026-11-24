"use strict";

const questionsButton = document.querySelector("#questions");
const mapContainer = document.querySelector("#campus-map");

if (questionsButton) {
  const contactLink = document.querySelector('footer a[href^="mailto:"]');
  const emailAddress = contactLink.getAttribute("href").slice("mailto:".length);

  questionsButton.addEventListener("click", () => {
    window.alert("If you have questions, contact me at:\n" + emailAddress);
  });
}

if (mapContainer) {
  const campus = { lat: 41.8349, lng: -87.6270 };
  const campusZoom = 16;
  const resetButton = document.querySelector("#reset-map");
  const status = document.querySelector("#map-status");

  function showMapError() {
    resetButton.disabled = true;
    status.textContent = "Google Maps could not load. Use the Open in Google Maps link below.";
    mapContainer.replaceChildren(status);
  }

  window.gm_authFailure = showMapError;

  window.initMap = async function () {
    try {
      const { Map, InfoWindow } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const map = new Map(mapContainer, {
        center: campus,
        zoom: campusZoom,
        mapId: "DEMO_MAP_ID"
      });

      const marker = new AdvancedMarkerElement({
        map,
        position: campus,
        title: "Illinois Tech Mies Campus",
        gmpClickable: true
      });

      const campusInfo = new InfoWindow({
        content: "Illinois Tech Mies Campus, Chicago"
      });

      marker.addEventListener("gmp-click", () => {
        campusInfo.open({ map, anchor: marker });
      });

      resetButton.addEventListener("click", () => {
        campusInfo.close();
        map.setCenter(campus);
        map.setZoom(campusZoom);
      });
      resetButton.disabled = false;
    } catch (error) {
      showMapError();
    }
  };

  const mapsScript = document.createElement("script");
  const mapsUrl = new URL("https://maps.googleapis.com/maps/api/js");
  mapsUrl.search = new URLSearchParams({
    key: mapContainer.dataset.mapsKey,
    callback: "initMap",
    loading: "async",
    v: "weekly"
  }).toString();
  mapsScript.src = mapsUrl.href;
  mapsScript.async = true;
  mapsScript.addEventListener("error", showMapError);
  document.head.append(mapsScript);
}
