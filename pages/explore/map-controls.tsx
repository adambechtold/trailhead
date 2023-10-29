import InterpolateMap from "@/components/InterpolateMap";
import { Pin } from "@/types/Vector";
import { configurations } from "../../types/overlay.configurations";

export default function ExploreInterpolatePosition() {
  const configuration = configurations[0];
  const start: Pin = configuration.start;
  const end: Pin = configuration.end;

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
        mapURL={MAP_URL}
      />
    </div>
  );
}
