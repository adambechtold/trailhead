import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useMapContext } from "@/contexts/MapContext";
import { useUserAgreementContext } from "@/contexts/UserAgreementContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import AddMap from "../AddMap/AddMap";
import Crosshairs from "@/components/Crosshairs";
import MenuTray from "@/components/MenuTray";
import SettingsPanel from "../SettingsPanel/SettingsPanel";

import HelpButton from "../HelpButton";
import UserLocationPanel from "../Debug/UserLocationPanel/UserLocationPanel";
import { notifyWatchingLocationFailed } from "../Toasts/FailTrackingLocation/FailTrackingLocation";
import styles from "./Navigate.module.css";

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
    canWatchUserHeading,
    isWatchingHeading,
    startWatchingHeading,
    startWatchingUserLocation,
  } = useUserLocationContext();
  const { hasAgreedToUserAgreement } = useUserAgreementContext();
  const router = useRouter();
  const hasMap = !!map;

  useEffect(() => {
    let isMounted = true;

    const tryWatchingLocation = async () => {
      try {
        await startWatchingUserLocation();
      } catch (error) {
        if (isMounted) {
          notifyWatchingLocationFailed();
        }
      }
    };

    if (!hasAgreedToUserAgreement) {
      router.push({ pathname: "/disclaimer" });
    } else if (!isWatchingLocation && !!map) {
      tryWatchingLocation();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when a map is first loaded or removed
  }, [hasMap]);

  const canDisplayResetButton = !!(map && map.pins && map.pins.length > 0);

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
        <UserLocationPanel map={map} />
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
