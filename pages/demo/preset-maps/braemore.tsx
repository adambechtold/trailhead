import React, { useState, useEffect } from "react";
import { Map } from "@/types/Map";
import { Location } from "@/types/Vector";
import AccuracyIndicator from "@/components/AccuracyIndicator/AccuracyIndicator";
import InterpolateMap from "@/components/InterpolateMap";

import { useUserLocationContext } from "@/contexts/UserLocationContext";

import styles from "@/components/Navigate/Navigate.module.css";
import mapStyles from "@/components/CurrentMap/CurrentMap.module.css";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";
import Button from "@/components/Buttons/Button";
import { ArrowIcon, CompassIcon } from "@/components/Icons/Icons";
import { EnableCompassButton } from "@/components/Buttons/EnableCompassButton/EnableCompassButton";

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
      {map &&
        DemoMap({
          map,
          userLocation: currentAcceptedUserLocation,
          isWatchingLocation,
          startWatchingUserLocation,
        })}
    </>
  );
}

type DemoMapProps = {
  map: Map;
  userLocation: Location | null;
  isWatchingLocation: boolean;
  startWatchingUserLocation: () => void;
};

function DemoMap({
  map,
  userLocation,
  isWatchingLocation,
  startWatchingUserLocation,
}: DemoMapProps) {
  const initialScale = 0.4;
  const canFindUserLocationOnMap = !!map.start && !!map.end && !!userLocation;
  const {
    currentHeading,
    startWatchingHeading,
    canWatchUserHeading,
    isWatchingHeading,
  } = useUserLocationContext();

  return (
    <>
      <InterpolateMap
        start={map.start}
        end={map.end}
        initialScale={initialScale}
        userLocation={userLocation ? userLocation : undefined}
        mapURL={map.url}
        pinScale={map.pinScale}
        hideConfigurationPins={true}
        userHeading={currentHeading ? currentHeading : undefined}
      >
        {canFindUserLocationOnMap && (
          <ZoomToUserButton
            className={mapStyles["position-zoom-to-user"]}
            isEnabled={isWatchingLocation}
          />
        )}
      </InterpolateMap>
      {canFindUserLocationOnMap &&
        canWatchUserHeading &&
        !isWatchingHeading && (
          <div style={{ top: "1.5rem", right: "1rem", position: "fixed" }}>
            <Button
              onClick={() => startWatchingHeading()}
              type="opaque"
              isElevated
              size="medium"
            >
              <CompassIcon />
              Enable Compass
            </Button>
          </div>
        )}

      {!isWatchingLocation && (
        <div
          style={{
            bottom: "3rem",
            left: "50%",
            transform: "translate(-50%, 0)",
            position: "fixed",
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Button
            onClick={() => startWatchingUserLocation()}
            type="opaque"
            size="medium"
            isElevated
          >
            <ArrowIcon isFilled={isWatchingLocation} /> Find Your Location
          </Button>
        </div>
      )}
    </>
  );
}
