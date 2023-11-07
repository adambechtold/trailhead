import React from "react";
import toast from "react-hot-toast";

import { ArrowIcon, CompassIcon, DownloadIcon } from "@/components/Icons/Icons";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import Button from "@/components/Buttons/Button";
import InterpolateMap from "@/components/InterpolateMap";
import UserLocationPanel from "../Debug/UserLocationPanel/UserLocationPanel";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";

import { Map } from "@/types/Map";

import styles from "./SingleMapNavigation.module.css";

type DemoMapProps = {
  map: Map;
  mapName: string;
};

const notifyWatchingLocation = () => {
  console.log("Toast!");
  toast.success("Tracking your location. Enjoy the hike!", {
    duration: 4000,
    position: "bottom-center",
  });
};

export default function SingleMapNavigation({ map, mapName }: DemoMapProps) {
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
  const canFindUserLocationOnMap =
    Boolean(map.start) && Boolean(map.end) && Boolean(userLocation);

  function downloadMap(src: string, fileName: string) {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onStartWatchingUserLocation() {
    startWatchingUserLocation();
    notifyWatchingLocation();
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
            onClick={() => onStartWatchingUserLocation()}
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
