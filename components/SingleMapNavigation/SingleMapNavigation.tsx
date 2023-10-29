import React, { useState } from "react";
import { Map } from "@/types/Map";
import AccuracyIndicator from "@/components/Debug/UserLocationPanel/AccuracyIndicator/AccuracyIndicator";
import InterpolateMap from "@/components/InterpolateMap";

import { useUserLocationContext } from "@/contexts/UserLocationContext";

import styles from "./SingleMapNavigation.module.css";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";
import Button from "@/components/Buttons/Button";
import { ArrowIcon, CompassIcon, DownloadIcon } from "@/components/Icons/Icons";
import { getUserPin } from "@/utils/vector";
import UserLocationPanel from "../Debug/UserLocationPanel/UserLocationPanel";

type DemoMapProps = {
  map: Map;
  mapName: string;
};

export default function DemoMap({ map, mapName }: DemoMapProps) {
  const {
    isWatchingLocation,
    startWatchingUserLocation,
    currentAcceptedUserLocation: userLocation,
    currentHeading,
    startWatchingHeading,
    isWatchingHeading,
    canWatchUserHeading,
  } = useUserLocationContext();

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

  return (
    <>
      <InterpolateMap
        start={map.start}
        end={map.end}
        initialScale={initialScale}
        userLocation={userLocation ? userLocation : undefined}
        mapURL={map.url}
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

      <div className={styles["position-user-location-panel"]}>
        <UserLocationPanel map={map} />
      </div>
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
