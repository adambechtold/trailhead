// this components job is just to pass the state into one of the stateless options
// Consider renaming it to MapDisplay or Map
import { Pin, Location } from "@/types/Vector";
import { useMapContext } from "@/contexts/MapContext";
import { InterpolateMap } from "@/components/InterpolateMap";

type Props = {
  start?: Pin;
  end?: Pin;
  userLocation?: Location;
};

export default function CurrentMap(props: Props) {
  const { mapURL } = useMapContext();
  const { start, end, userLocation } = props;

  return (
    <InterpolateMap
      start={start}
      end={end}
      userLocation={userLocation}
      mapURL={mapURL}
    />
  );
}
