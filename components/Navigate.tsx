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
import { EnableCompassButton } from "./EnableCompassButton";

const CurrentMap = dynamic(() => import("@/components/CurrentMap"), {
  ssr: false,
});

export default function Navigate() {
  const { resetPins, map, setPinScale } = useMapContext();
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

  const canDisplayResetButton = !!(map && (map.start || map.end));
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
      {map && (
        <div className={styles["position-settings-panel"]}>
          <SettingsPanel
            pinScale={map.pinScale || 1}
            setPinScale={(scale: number) => setPinScale(map, scale)}
            canResetPins={canDisplayResetButton}
            resetPins={onReset}
          />
        </div>
      )}
      <Crosshairs />
      {!map && <AddMap />}
      {map && <CurrentMap />}
      <MenuTray />
    </>
  );
}
