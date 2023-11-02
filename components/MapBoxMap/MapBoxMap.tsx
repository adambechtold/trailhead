import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./MapBoxMap.module.css";

export default function MapBoxMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWRhbWJlY2h0b2xkIiwiYSI6ImNsb2hrNXQ0djE2ODgyanQ4MGpuMGpkNzIifQ.V7Fay_b1qk8Wl_RT5aFh2Q";

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-72.6965);
  const [lat, setLat] = useState(41.35453);
  const [zoom, setZoom] = useState(13);
  console.log("lat", lat);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      console.log("move!");
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div ref={mapContainer} className={styles["map-container"]}></div>
    </div>
  );
}
