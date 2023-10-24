import React, { useState, useEffect } from "react";
import { Map } from "@/types/Map";
import { Location } from "@/types/Vector";
import AccuracyIndicator from "@/components/AccuracyIndicator/AccuracyIndicator";
import InterpolateMap from "@/components/InterpolateMap";

import { useUserLocationContext } from "@/contexts/UserLocationContext";

import styles from "@/components/Navigate/Navigate.module.css";
import mapStyles from "@/components/CurrentMap/CurrentMap.module.css";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";

export default function BraemorePage() {
  const {
    isWatchingLocation,
    startWatchingUserLocation,
    currentAcceptedUserLocation,
    error: userLocationError,
    mostRecentLocation,
  } = useUserLocationContext();

  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    async function fetchMap() {
      const response = await fetch("/preset-maps/map-braemore-imprecise.json");
      const jsonData = await response.json();
      setMap(jsonData);
    }
    fetchMap();

    if (!isWatchingLocation) startWatchingUserLocation();
  }, []);

  const canDisplayAccuracyIndicator =
    currentAcceptedUserLocation || isWatchingLocation || userLocationError;
  let accuracyToDisplay = currentAcceptedUserLocation?.accuracy;
  if (isWatchingLocation) {
    if (mostRecentLocation) {
      accuracyToDisplay = mostRecentLocation.accuracy;
    } else {
      accuracyToDisplay = undefined;
    }
  }

  return (
    <>
      <div className={styles["accuracy-indicator-container"]}>
        {canDisplayAccuracyIndicator && (
          <AccuracyIndicator
            accuracy={accuracyToDisplay}
            isUpdating={isWatchingLocation}
            error={!!userLocationError}
          />
        )}
      </div>
      {!map && <div>Loading...</div>}
      {map && DemoMap({ map, userLocation: currentAcceptedUserLocation })}
    </>
  );
}

type DemoMapProps = {
  map: Map;
  userLocation: Location | null;
};

function DemoMap({ map, userLocation }: DemoMapProps) {
  const initialScale = 0.4;
  const canFindUserLocationOnMap = !!map.start && !!map.end && !!userLocation;

  return (
    <InterpolateMap
      start={map.start}
      end={map.end}
      initialScale={initialScale}
      userLocation={userLocation ? userLocation : undefined}
      mapURL={map.url}
      pinScale={map.pinScale}
      hideConfigurationPins={true}
    >
      {canFindUserLocationOnMap && (
        <ZoomToUserButton className={mapStyles["position-zoom-to-user"]} />
      )}
    </InterpolateMap>
  );
}
