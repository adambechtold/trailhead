import React, { useEffect } from "react";
import dynamic from "next/dynamic";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import Button from "./Button/Button";
import AccuracyIndicator from "./AccuracyIndicator/AccuracyIndicator";
import AddMap from "./AddMap/AddMap";

import styles from "./Navigate.module.css";
import HelpButton from "./HelpButton";
import { EnableCompassButton } from "./EnableCompassButton";

const CurrentMap = dynamic(() => import("@/components/CurrentMap"), {
  ssr: false,
});

export default function Navigate() {
  const { resetPins, map } = useMapContext();
  const { endCreatePin } = useCreatePinContext();
  const {
    isWatchingLocation,
    currentAcceptedUserLocation,
    canWatchUserHeading,
    isWatchingHeading,
    startWatchingHeading,
    error: userLocationError,
    mostRecentLocation,
    startWatchingUserLocation,
  } = useUserLocationContext();

  useEffect(() => {
    if (!isWatchingLocation) startWatchingUserLocation();
  }, []);

  const canDisplayResetButton = map && (map.start || map.end);
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

  const onReset = () => {
    const result = confirm("Are you sure you want to reset the pins?");
    if (!result) return;
    // User Clicked OK
    resetPins(map);
    endCreatePin();
  };

  return (
    <>
      <div className={styles["button-container"]}>
        {canDisplayAccuracyIndicator && (
          <div className={styles["position-accuracy-indicator"]}>
            <AccuracyIndicator
              accuracy={accuracyToDisplay}
              isUpdating={isWatchingLocation}
              error={!!userLocationError}
            />
          </div>
        )}
        <HelpButton />
        {canWatchUserHeading && !isWatchingHeading && (
          <EnableCompassButton onClick={startWatchingHeading} />
        )}
      </div>
      {canDisplayResetButton && (
        <div className={styles["position-reset-button"]}>
          <Button onClick={onReset}>RESET PINS</Button>
        </div>
      )}
      <Crosshairs />
      {!map && <AddMap />}
      {map && <CurrentMap />}
      <MenuTray />
    </>
  );
}
