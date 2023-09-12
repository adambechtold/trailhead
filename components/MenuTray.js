import { useState } from "react";

import ManageMap from "@/components/ManageMap";
import DisplayMapData from "@/components/Debug/DisplayMapData";

import styles from "@/components/MenuTray.module.css";

export default function MenuTray({
  isSettingLocation,
  setIsSettingLocation,
  pins,
  setPins,
  crosshairsPosition,
  mapPosition,
  userLocation,
  updateUserLocation,
  isUpdatingLocation,
  updatingLocationFailed,
  locationAccuracy,
}) {
  const [showDebuggingContent, setShowDebuggingContent] = useState(false);

  return (
    <div
      className={`${styles.container} ${
        showDebuggingContent ? styles.expanded : styles.contracted
      }`}
    >
      <button
        onClick={() => setShowDebuggingContent(!showDebuggingContent)}
        className={styles.inspectDataButton}
      >
        Inspect Data
      </button>
      {!showDebuggingContent && (
        <ManageMap
          isSettingLocation={isSettingLocation}
          setIsSettingLocation={setIsSettingLocation}
          pins={pins}
          setPins={setPins}
          crosshairsPosition={crosshairsPosition}
          mapPosition={mapPosition}
          locationAccuracy={locationAccuracy}
          updateUserLocation={updateUserLocation}
          isUpdatingLocation={isUpdatingLocation}
          updatingLocationFailed={updatingLocationFailed}
        />
      )}
      {showDebuggingContent && (
        <div className={styles.debugContainer}>
          <DisplayMapData pins={pins} userLocation={userLocation} />
        </div>
      )}
    </div>
  );
}
