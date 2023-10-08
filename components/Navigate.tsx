import React, { useEffect } from "react";
import dynamic from "next/dynamic";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import AccuracyIndicator from "./AccuracyIndicator/AccuracyIndicator";
import AddMap from "./AddMap/AddMap";
import SettingsPanel from "./SettingsPanel/SettingsPanel";

import styles from "./Navigate.module.css";
import HelpButton from "./HelpButton";

const CurrentMap = dynamic(() => import("@/components/CurrentMap"), {
  ssr: false,
});

export default function Navigate() {
  const { resetPins, map, setPinScale } = useMapContext();
  const { endCreatePin } = useCreatePinContext();
  const {
    isWatchingLocation,
    currentAcceptedUserLocation,
    isUserPathDisplayed,
    showUserPath,
    hideUserPath,
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

  const canDisplayResetButton = !!(map && map.pins && map.pins.length > 0);
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

  const onToggleUserPathDisplayed = () => {
    if (isUserPathDisplayed) {
      hideUserPath();
    } else {
      showUserPath();
    }
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
      </div>
      <div className={styles["position-settings-panel"]}>
        <HelpButton />
        {map &&
          ((canWatchUserHeading && !isWatchingHeading) ||
            canDisplayResetButton) && (
            <SettingsPanel
              pinScale={map.pinScale || 1}
              setPinScale={(scale: number) => setPinScale(map, scale)}
              canResetPins={canDisplayResetButton}
              resetPins={onReset}
              isUserPathDisplayed={isUserPathDisplayed}
              onToggleUserPathDisplayed={onToggleUserPathDisplayed}
              showEnableCompass={canWatchUserHeading && !isWatchingHeading}
              startWatchingUserHeading={startWatchingHeading}
            />
          )}
      </div>
      <Crosshairs />
      {!map && <AddMap />}
      {map && <CurrentMap />}
      <MenuTray />
    </>
  );
}
