import dynamic from "next/dynamic";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import ClearButton from "./ClearButton/ClearButton";
import AccuracyIndicator from "./AccuracyIndicator/AccuracyIndicator";

import styles from "./Navigate.module.css";

const CurrentMap = dynamic(() => import("@/components/CurrentMap"), {
  ssr: false,
});

export default function Navigate() {
  const { resetPins, map } = useMapContext();
  const { endCreatePin } = useCreatePinContext();
  const { updateStatus: updateUserLocationStatus, userLocation } =
    useUserLocationContext();
  const isUpdatingLocation = updateUserLocationStatus.isUpdating;

  const canDisplayResetButton = map.start || map.end;
  const canDisplayAccuracyIndicator =
    userLocation || isUpdatingLocation || updateUserLocationStatus.error;
  let accuracyToDisplay = userLocation?.accuracy;
  if (isUpdatingLocation) {
    if (updateUserLocationStatus.pendingLocation) {
      accuracyToDisplay = updateUserLocationStatus.pendingLocation.accuracy;
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
      {canDisplayAccuracyIndicator && (
        <div className={styles["position-accuracy-indicator"]}>
          <AccuracyIndicator
            accuracy={accuracyToDisplay}
            isUpdating={updateUserLocationStatus.isUpdating}
            error={!!updateUserLocationStatus.error}
          />
        </div>
      )}
      {canDisplayResetButton && (
        <div className={styles["position-reset-button"]}>
          <ClearButton onClick={onReset}>RESET PINS</ClearButton>
        </div>
      )}
      <Crosshairs />
      <CurrentMap />
      <MenuTray />
    </>
  );
}
