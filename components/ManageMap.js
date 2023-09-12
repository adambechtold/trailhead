import styles from "@/components/ManageMap.module.css";

import { useMapContext } from "@/contexts/MapContext";

export default function ManageMap({
  isSettingLocation,
  setIsSettingLocation,
  crosshairsPosition,
  locationAccuracy,
  updateUserLocation,
  isUpdatingLocation,
  updatingLocationFailed,
}) {
  const { start, end, addPin, mapPosition } = useMapContext();

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  };

  const handleAddPin = ({ coordinates, accuracy }) => {
    const { latitude, longitude } = coordinates;
    const { scale } = mapPosition;

    const newPin = {
      mapPoint: {
        x: (crosshairsPosition.x - mapPosition.x) / scale,
        y: -(crosshairsPosition.y - mapPosition.y) / scale,
      },
      location: {
        coordinates: {
          latitude,
          longitude,
        },
        accuracy,
      },
    };

    addPin(newPin);
  };

  const handleConfirmLocation = () => {
    updateUserLocation({
      callback: handleAddPin,
    });
    toggleIsSettingLocation();
  };

  const handleUpdateLocation = () => {
    updateUserLocation({
      callback: (location) => {}, // remove this callback
    });
  };

  const showGPSStatusBar = () => {
    const getLoadingBarClass = () => {
      if (locationAccuracy < 5) {
        return styles.loadingBarGreen;
      } else if (locationAccuracy < 10) {
        return styles.loadingBarYellow;
      } else if (locationAccuracy < 20) {
        return styles.loadingBarOrange;
      } else {
        return styles.loadingBarRed;
      }
    };

    const loadingZoneContent = () => {
      if (isUpdatingLocation) {
        return (
          <>
            <>🤳</>
            <div className={styles.loadingBarBackground}>
              <div className={`${styles.loadingBar} ${getLoadingBarClass()}`} />
            </div>
            <>🛰</>
          </>
        );
      } else if (updatingLocationFailed) {
        return (
          <div className={styles.failureBar}>Poor GPS signal. Try again.</div>
        );
      }
      return null;
    };

    return (
      <div className={styles.updateLocationContainer}>
        <div className={styles.visualizeTransmissionContainer}>
          {loadingZoneContent()}
        </div>
        {isUpdatingLocation ? locationAccuracy.toFixed(1) + "m" : null}
      </div>
    );
  };

  const getLocationButtonText = () => {
    if (!start) return "Set Location";
    if (!end) return "Set Another Location";
    return;
  };

  const displaySetLocationButton = () => {
    if (isSettingLocation) return false;
    if (!start || !end) return true;
  };

  return (
    <>
      {showGPSStatusBar()}
      <div className={styles.container}>
        <div className={styles.manageLocation}>
          {isSettingLocation && (
            <button className={styles.button} onClick={handleConfirmLocation}>
              Confirm
            </button>
          )}
          {isSettingLocation && (
            <button className={styles.button} onClick={toggleIsSettingLocation}>
              Cancel
            </button>
          )}

          {displaySetLocationButton() && (
            <button className={styles.button} onClick={toggleIsSettingLocation}>
              {getLocationButtonText()}
            </button>
          )}
          <button className={styles.button} onClick={handleUpdateLocation}>
            Update Location
          </button>
        </div>
      </div>
    </>
  );
}
