// this components job is just to pass the state into one of the stateless options
// Consider renaming it to MapDisplay or Map
import { Location } from "@/types/Vector";
import { useMapContext } from "@/contexts/MapContext";
import { InterpolateMap } from "@/components/InterpolateMap";
import { MapPosition } from "@/types/MapPosition";

type Props = {
  userLocation?: Location;
};

export default function CurrentMap(props: Props) {
  const { mapURL, start, end, mapPosition, setMapPosition } = useMapContext();
  const { userLocation } = props;

  const scale = mapPosition?.scale || 0.4;

  const handleMapStateUpdate = ({ x, y, scale }: MapPosition) => {
    setMapPosition({ x, y, scale });
  };

  return (
    <InterpolateMap
      start={start}
      end={end}
      userLocation={userLocation}
      mapURL={mapURL}
      scale={scale}
      onMapStateUpdate={handleMapStateUpdate}
    />
  );
}
