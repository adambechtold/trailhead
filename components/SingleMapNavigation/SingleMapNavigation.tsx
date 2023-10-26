import React, { useState } from "react";
import { Map } from "@/types/Map";
import AccuracyIndicator from "@/components/AccuracyIndicator/AccuracyIndicator";
import InterpolateMap from "@/components/InterpolateMap";

import { useUserLocationContext } from "@/contexts/UserLocationContext";

import styles from "./SingleMapNavigation.module.css";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";
import Button from "@/components/Buttons/Button";
import { ArrowIcon, CompassIcon, DownloadIcon } from "@/components/Icons/Icons";
import { getUserPin } from "@/utils/vector";

type DemoMapProps = {
  map: Map;
  mapName: string;
};

export default function DemoMap({ map, mapName }: DemoMapProps) {
  const {
    isWatchingLocation,
    startWatchingUserLocation,
    currentAcceptedUserLocation: userLocation,
    error: userLocationError,
    mostRecentLocation,
    currentHeading,
    startWatchingHeading,
    isWatchingHeading,
    canWatchUserHeading,
  } = useUserLocationContext();
  const [displayDebugPanel, setDisplayDebugPanel] = useState<Boolean>(false);

  const canDisplayAccuracyIndicator =
    userLocation || isWatchingLocation || userLocationError;
  let accuracyToDisplay = userLocation?.accuracy;
  if (isWatchingLocation) {
    if (mostRecentLocation) {
      accuracyToDisplay = mostRecentLocation.accuracy;
    } else {
      accuracyToDisplay = undefined;
    }
  }

  const initialScale = 0.4;
  const canFindUserLocationOnMap = !!map.start && !!map.end && !!userLocation;

  function downloadMap(src: string, fileName: string) {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  let userPin = null;

  if (map.start && map.end && userLocation) {
    userPin = getUserPin(map.start, map.end, userLocation);
  }

  return (
    <>
      {userPin && displayDebugPanel && (
        <div
          className={[styles["debug-panel"], "clear"].join(" ")}
          onClick={() => setDisplayDebugPanel(false)}
        >
          <div className={styles["content"]}>
            <h4>User Pin</h4>
            <h5>Coordinates</h5>

            <p>Longitude: {userPin.location.coordinates.longitude}</p>
            <p>Latitude: {userPin.location.coordinates.latitude}</p>
            <p>Accuracy: {userPin.location.accuracy}</p>
            <h5>Map Point</h5>
            <p>top: {-1 * userPin.mapPoint.y}</p>
            <p>left: {userPin.mapPoint.x}</p>
          </div>
        </div>
      )}
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
            className={styles["position-zoom-to-user-button"]}
            isEnabled={isWatchingLocation}
          />
        )}
      </InterpolateMap>

      {canDisplayAccuracyIndicator && (
        <div
          className={styles["position-accuracy-indicator"]}
          onClick={() => setDisplayDebugPanel(true)}
        >
          <AccuracyIndicator
            accuracy={accuracyToDisplay}
            isUpdating={isWatchingLocation}
            error={!!userLocationError}
          />
        </div>
      )}
      {canFindUserLocationOnMap &&
        canWatchUserHeading &&
        !isWatchingHeading && (
          <div className={styles["position-enable-compass-button"]}>
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
        <div className={styles["position-find-location-button"]}>
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
      <div className={styles["position-download-button"]}>
        <Button
          onClick={() => downloadMap(map.url, mapName)}
          type="opaque"
          size="medium"
          isElevated
        >
          <DownloadIcon />
        </Button>
      </div>
    </>
  );
}
