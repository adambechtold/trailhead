import InterpolateMap from "@/components/InterpolateMap";
import { Pin } from "@/types/Vector";
import { configurations } from "../../types/overlay.configurations";
import { useState } from "react";

export default function ExploreInterpolatePosition() {
  const configuration = configurations[0];
  const start: Pin = configuration.start;
  const end: Pin = configuration.end;

  const [heading, setHeading] = useState(0);
  const [pinScale, setPinScale] = useState(1);

  const currentUserLocation = {
    coordinates: {
      longitude: start.location.coordinates.longitude,
      latitude: start.location.coordinates.latitude,
    },
  };

  const MAP_URL = "/images/trailmap-timberlands-precise-1.jpeg";

  return (
    <div>
      <InterpolateMap
        start={start}
        end={end}
        userLocation={currentUserLocation}
        userHeading={heading}
        mapURL={MAP_URL}
        pinScale={pinScale}
      />
    </div>
  );
}
