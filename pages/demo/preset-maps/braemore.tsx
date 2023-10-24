import React, { useState, useEffect } from "react";
import { Map } from "@/types/Map";

import SingleMapNavigation from "@/components/SingleMapNavigation/SingleMapNavigation";

export default function BraemorePage() {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    async function fetchMap() {
      const response = await fetch("/preset-maps/map-braemore-imprecise.json");
      const jsonData = await response.json();
      setMap(jsonData);
    }
    fetchMap();
  }, []);

  return (
    <>
      {!map && <div>Loading...</div>}
      {map && <SingleMapNavigation map={map} mapName={"braemore"} />}
    </>
  );
}
