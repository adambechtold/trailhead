import React from "react";

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

  const start = pins[0].location.coordinates;
  const end = pins[1].location.coordinates;
  const deltaLongitude = end.longitude - start.longitude;
  const deltaLatitude = end.latitude - start.latitude;
  const numberOfPoints = 10;
  const userPath = [];
  for (let i = 0; i < numberOfPoints; i++) {
    const longitude = start.longitude + (deltaLongitude / numberOfPoints) * i;
    const latitude = start.latitude + (deltaLatitude / numberOfPoints) * i;
    userPath.push({
      coordinates: {
        longitude,
        latitude,
      },
    });
  }

  return (
    <div>
      <h1>Let's Explore Interpolation Strategies</h1>
      <div className={styles.container}>
        {/*<div className={styles["map-container"]}>
          <h2>Strategy: First Two Points</h2>
          <InterpolateMap
            pins={pins}
            mapURL={configuration.url}
            userLocation={currentUserLocation}
            userPath={userPath}
            conversionStrategy={{
              scalerStrategy: "FIRST_TWO_POINTS",
              originStrategy: "FIRST_POINT",
            }}
          />
        </div> */}
        {/*<div className={styles["map-container"]}>
          <h2>Strategy: Most X and Y, but Based on First Point</h2>
          <InterpolateMap
            pins={pins}
            mapURL={configuration.url}
            userLocation={currentUserLocation}
            userPath={userPath}
            conversionStrategy={{
              scalerStrategy: "MOST-X_MOST-Y",
              originStrategy: "FIRST_POINT",
            }}
          />
        </div>*/}
        <div className={styles["map-container"]}>
          <h2>Strategy: Closest Pin, Scaler from First Points</h2>
          <InterpolateMap
            pins={pins}
            mapURL={configuration.url}
            userLocation={currentUserLocation}
            userPath={userPath}
            conversionStrategy={{
              scalerStrategy: "FIRST_TWO_POINTS",
              originStrategy: "CLOSEST_POINT",
            }}
          />
        </div>
        {/*<div className={styles["map-container"]}>
          <h2>Strategy: Most and Closest</h2>
          <InterpolateMap
            pins={pins}
            mapURL={configuration.url}
            userLocation={currentUserLocation}
            userPath={userPath}
            conversionStrategy={{
              scalerStrategy: "MOST-X_MOST-Y",
              originStrategy: "CLOSEST_POINT",
            }}
          />
          </div>*/}
      </div>
    </div>
  );
}
