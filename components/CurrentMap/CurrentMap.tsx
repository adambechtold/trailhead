// this components job is just to pass the state into one of the stateless options
// Consider renaming it to MapDisplay or Map
import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import InterpolateMap from "@/components/InterpolateMap";
import { MapPosition } from "@/types/MapPosition";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";

import styles from "./CurrentMap.module.css";

export default function CurrentMap() {
  const { map, mapPosition, setMapPosition } = useMapContext();
  const { currentAcceptedUserLocation, currentHeading } =
    useUserLocationContext();

  const initialScale = mapPosition?.scale || 0.4;

  const handleMapStateUpdate = ({ x, y, scale }: MapPosition) => {
    setMapPosition({ x, y, scale });
  };

  if (!map) return null;
  const canFindUserLocationOnMap =
    !!map.start && !!map.end && !!currentAcceptedUserLocation;

  // adjust pin scale to target a particular screen size
  const defaultPinSize = 50; // px
  const pinSize = map.pinScale ? defaultPinSize * map.pinScale : defaultPinSize;

  return (
    <InterpolateMap
      start={map.start}
      end={map.end}
      userLocation={
        currentAcceptedUserLocation ? currentAcceptedUserLocation : undefined
      }
      userHeading={currentHeading != null ? currentHeading : undefined}
      mapURL={map.url}
      initialScale={initialScale}
      pinSize={pinSize}
      onMapStateUpdate={handleMapStateUpdate}
    >
      {canFindUserLocationOnMap && (
        <ZoomToUserButton
          className={styles["position-zoom-to-user"]}
          isEnabled
        />
      )}
    </InterpolateMap>
  );
}
