import React from "react";
import dynamic from "next/dynamic";

import styles from "./play-with-geotiff.module.css";
import { Coordinates } from "@/types/Vector";
import TestMap from "@/components/MapBoxMap/MapBoxMap";

export default function PlayWithGeoTIFF() {
  const path: Coordinates[] = [
    {
      latitude: 33.4637470333153,
      longitude: -111.94311282885029,
    },
    {
      latitude: 33.46021156541301,
      longitude: -111.94415352593668,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <TestMap />
      </div>
    </div>
  );
}
