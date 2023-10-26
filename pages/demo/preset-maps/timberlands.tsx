import React from "react";
import { Map } from "@/types/Map";
import { Pin } from "@/types/Vector";

import SingleMapNavigation from "@/components/SingleMapNavigation/SingleMapNavigation";
import { configurations } from "@/types/overlay.configurations";

export default function BraemorePage() {
  const bestConfiguration = configurations[2];
  const start: Pin = bestConfiguration.start;
  const end: Pin = bestConfiguration.end;
  const map: Map = {
    start: start,
    end: end,
    url: bestConfiguration.url,
    pinScale: 2,
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
