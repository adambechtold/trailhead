import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import ClearButton from "./ClearButton/ClearButton";
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
    startWatchingHeading,
    error: userLocationError,
    mostRecentLocation,
    startWatchingUserLocation,
  } = useUserLocationContext();
  const router = useRouter();

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
    resetPins();
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
        {canWatchUserHeading && (
          <EnableCompassButton onClick={startWatchingHeading} />
        )}
      </div>
      {canDisplayResetButton && (
        <div className={styles["position-reset-button"]}>
          <ClearButton onClick={onReset}>RESET PINS</ClearButton>
        </div>
      )}
      <Crosshairs />
      {!map && <AddMap />}
      {map && <CurrentMap />}
      <MenuTray />
    </>
  );
}
