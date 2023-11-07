import React from "react";
import toast from "react-hot-toast";

import { ArrowIcon, CompassIcon, DownloadIcon } from "@/components/Icons/Icons";
import Button from "@/components/Buttons/Button";
import ConfirmTrackingLocation from "@/components/Toasts/ConfirmTrackingLocation/ConfirmTrackingLocation";
import FailTrackingLocation from "@/components/Toasts/FailTrackingLocation/FailTrackingLocation";
import InterpolateMap from "@/components/InterpolateMap";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import UserLocationPanel from "../Debug/UserLocationPanel/UserLocationPanel";
import ZoomToUserButton from "@/components/Buttons/ZoomToUserButton/ZoomToUserButton";
import { Map } from "@/types/Map";

import styles from "./SingleMapNavigation.module.css";

type DemoMapProps = {
  map: Map;
  mapName: string;
};

function notifyWatchingLocation() {
  toast(
    (t) => <ConfirmTrackingLocation onDismiss={() => toast.dismiss(t.id)} />,
    {
      duration: 10_000,
    }
  );
}

function notifyWatchingFailed() {
  toast((t) => <FailTrackingLocation onDismiss={() => toast.dismiss(t.id)} />, {
    duration: Infinity,
  });
}

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
    map.pins && map.pins.length >= 2 && !!userLocation;

  function downloadMap(src: string, fileName: string) {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function onStartWatchingUserLocation() {
    try {
      await startWatchingUserLocation();
      notifyWatchingLocation();
    } catch (error) {
      notifyWatchingFailed();
    }
  }

  return (
    <>
      <InterpolateMap
        pins={map.pins}
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
