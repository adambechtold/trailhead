import React, { useState, useEffect } from "react";

import InterpolateMap from "@/components/InterpolateMap";
import { configurations } from "@/types/overlay.configurations";

import styles from "./strategies.module.css";

export default function ExploreInterpolatePositionStrategies() {
  const configuration = configurations[0];
  const pins = configuration.pins;

  const currentUserLocation = {
    coordinates: {
      longitude: pins[0].location.coordinates.longitude,
      latitude: pins[0].location.coordinates.latitude,
    },
  };

  return (
    <div>
      <h1>Let's Explore Interpolation Strategies</h1>
      <div className={styles.container}>
        <div className={styles["map-container"]}>
          <h2>Strategy: First Two Points</h2>
          <InterpolateMap
            pins={pins}
            mapURL={configuration.url}
            userLocation={currentUserLocation}
            conversionStrategy={{
              scalerStrategy: "FIRST_TWO_POINTS",
              originStrategy: "FIRST_POINT",
            }}
          />
        </div>
        <div className={styles["map-container"]}>
          <h2>Strategy: Most and Closest</h2>
          <InterpolateMap
            pins={pins}
            mapURL={configuration.url}
            userLocation={currentUserLocation}
            conversionStrategy={{
              scalerStrategy: "MOST-X_MOST-Y",
              originStrategy: "CLOSEST_POINT",
            }}
          />
        </div>
      </div>
    </div>
  );
}
