import InterpolateMap from "@/components/InterpolateMap";
import { configurations } from "../../types/overlay.configurations";

export default function ExploreInterpolatePosition() {
  const configuration = configurations[0];
  const pins = configuration.pins;

  const currentUserLocation = {
    coordinates: {
      longitude: pins[0].location.coordinates.longitude,
      latitude: pins[0].location.coordinates.latitude,
    },
  };

  const MAP_URL = "/images/trailmap-timberlands-precise-1.jpeg";

  return (
    <div>
      <InterpolateMap
        pins={pins}
        userLocation={currentUserLocation}
        mapURL={MAP_URL}
      />
    </div>
  );
}
