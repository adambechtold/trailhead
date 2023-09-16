// this components job is just to pass the state into one of the stateless options
// Consider renaming it to MapDisplay or Map
import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import { InterpolateMap } from "@/components/InterpolateMap";
import { MapPosition } from "@/types/MapPosition";

export default function CurrentMap() {
  const { map, mapPosition, setMapPosition } = useMapContext();
  const { userLocation } = useUserLocationContext();

  const scale = mapPosition?.scale || 0.4;

  const handleMapStateUpdate = ({ x, y, scale }: MapPosition) => {
    setMapPosition({ x, y, scale });
  };

  if (!map) return null;

  return (
    <InterpolateMap
      start={map.start}
      end={map.end}
      userLocation={userLocation}
      mapURL={map.url}
      scale={scale}
      onMapStateUpdate={handleMapStateUpdate}
    />
  );
}
