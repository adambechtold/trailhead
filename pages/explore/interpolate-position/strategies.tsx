import React from "react";

import InterpolateMap from "@/components/InterpolateMap";
import { configurations } from "@/types/overlay.configurations";

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
      <InterpolateMap
        pins={pins}
        mapURL={configuration.url}
        userLocation={currentUserLocation}
      />
    </div>
  );
}
