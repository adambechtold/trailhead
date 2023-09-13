import styles from "@/components/ManageMap.module.css";

import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";

export default function ManageMap() {
  const { start, end, addPin, mapPosition } = useMapContext();
  const { updateStatus: updateUserLocationStatus, updateUserLocation } =
    useUserLocationContext();

  const {
    startCreatePin,
    endCreatePin,
    inProgress: isCreatingPin,
    getSelectedPosition,
  } = useCreatePinContext();

  const toggleIsCreatingPin = () => {
    if (isCreatingPin) {
      endCreatePin();
    } else {
      startCreatePin();
    }
  };

  const handleAddPin = ({ coordinates, accuracy }) => {
    const { latitude, longitude } = coordinates;
    const { scale } = mapPosition;
    const { x: selectedX, y: selectedY } = getSelectedPosition();

    const newPin = {
      mapPoint: {
        x: (selectedX - mapPosition.x) / scale,
        y: -(selectedY - mapPosition.y) / scale, // TODO adjust functionality so y is not inverted
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
    if (result && result.updateStatus.success) {
      const location = result.userLocation;
      handleAddPin(location);
    }
    toggleIsCreatingPin();
  };

  const handleUpdateLocation = async () => {
    await updateUserLocation();
  };

  const showGPSStatusBar = (updateUserLocationStatus) => {
    const { isUpdating, pendingLocation, error } = updateUserLocationStatus;
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
    if (isCreatingPin) return false;
    if (!start || !end) return true;
  };

  return (
    <>
      {showGPSStatusBar(updateUserLocationStatus)}
      <div className={styles.container}>
        <div className={styles.manageLocation}>
          {isCreatingPin && (
            <button className={styles.button} onClick={handleConfirmLocation}>
              Confirm
            </button>
          )}
          {isCreatingPin && (
            <button className={styles.button} onClick={toggleIsCreatingPin}>
              Cancel
            </button>
          )}

          {displaySetLocationButton() && (
            <button className={styles.button} onClick={toggleIsCreatingPin}>
              {getLocationButtonText()}
            </button>
          )}
          {!isCreatingPin && (
            <button className={styles.button} onClick={handleUpdateLocation}>
              Update Location
            </button>
          )}
        </div>
      </div>
    </>
  );
}
