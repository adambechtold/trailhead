import React from "react";
import { Map } from "@/types/Map";

import SingleMapNavigation from "@/components/SingleMapNavigation/SingleMapNavigation";
import { configurations } from "@/types/overlay.configurations";

export default function BraemorePage() {
  const bestConfiguration = configurations[2];
  const pins = bestConfiguration.pins;
  const map: Map = {
    pins,
    url: bestConfiguration.url,
    pinScale: 1,
    key: "map-timberlands",
    formatVersion: "0.1",
  };

  return (
    <>
      {!map && <div>Loading...</div>}
      {map && <SingleMapNavigation map={map} mapName={"timberlands"} />}
    </>
  );
}
