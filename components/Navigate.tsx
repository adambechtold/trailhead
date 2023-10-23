import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import { useUserAgreementContext } from "@/contexts/UserAgreementContext";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import AccuracyIndicator from "./AccuracyIndicator/AccuracyIndicator";
import AddMap from "./AddMap/AddMap";
import SettingsPanel from "./SettingsPanel/SettingsPanel";

import styles from "./Navigate.module.css";
import HelpButton from "./HelpButton";

const CurrentMap = dynamic(() => import("@/components/CurrentMap/CurrentMap"), {
  ssr: false,
});

export default function Navigate() {
  const { resetPins, map, setPinScale } = useMapContext();
  const {
    endCreatePin,
    inProgress: isCreatingPin,
    selectPositionElementName,
  } = useCreatePinContext();
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
  const { hasAgreedToUserAgreement } = useUserAgreementContext();
  const router = useRouter();

  useEffect(() => {
    if (!hasAgreedToUserAgreement) {
      router.push({ pathname: "/disclaimer" });
      return;
    }
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
      <div className={styles["accuracy-indicator-container"]}>
        {canDisplayAccuracyIndicator && (
          <AccuracyIndicator
            accuracy={accuracyToDisplay}
            isUpdating={isWatchingLocation}
            error={!!userLocationError}
          />
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
              showEnableCompass={canWatchUserHeading && !isWatchingHeading}
              startWatchingUserHeading={startWatchingHeading}
            />
          )}
      </div>
      {isCreatingPin && (
        <Crosshairs selectPositionElementName={selectPositionElementName} />
      )}
      {!map && <AddMap />}
      {map && <CurrentMap />}
      <MenuTray />
    </>
  );
}
