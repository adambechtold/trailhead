import styles from "@/components/ManageMap.module.css";

import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

export default function ManageMap({
  isSettingLocation,
  setIsSettingLocation,
  crosshairsPosition,
}) {
  const { start, end, addPin, mapPosition } = useMapContext();
  const { updateStatus, updateUserLocation } = useUserLocationContext();

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

  const handleConfirmLocation = async () => {
    const result = await updateUserLocation();
    if (result.updateStatus.success) {
      const location = result.userLocation;
      handleAddPin(location);
    }
    toggleIsSettingLocation();
  };

  const handleUpdateLocation = async () => {
    await updateUserLocation();
  };

  const showGPSStatusBar = (updateStatus) => {
    const { isUpdating, pendingLocation, error } = updateStatus;
    const accuracy = pendingLocation?.accuracy || 100;

    const getLoadingBarClass = (accuracy) => {
      if (accuracy < 5) {
        return styles.loadingBarGreen;
      } else if (accuracy < 10) {
        return styles.loadingBarYellow;
      } else if (accuracy < 20) {
        return styles.loadingBarOrange;
      } else {
        return styles.loadingBarRed;
      }
    };

    const loadingZoneContent = () => {
      if (isUpdating) {
        return (
          <>
            <>🤳</>
            <div className={styles.loadingBarBackground}>
              <div
                className={`${styles.loadingBar} ${getLoadingBarClass(
                  accuracy
                )}`}
              />
            </div>
            <>🛰</>
          </>
        );
      } else if (error) {
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
        {isUpdating ? accuracy.toFixed(1) + "m" : null}
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
      {showGPSStatusBar(updateStatus)}
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
