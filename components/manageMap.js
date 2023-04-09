
import styles from '@/components/ManageMap.module.css';

export default function ManageMap({
  isSettingLocation,
  setIsSettingLocation,
  pins,
  setPins,
  crosshairsPosition,
  mapPosition,
  locationAccuracy,
  updateUserLocation,
  isUpdatingLocation,
  updatingLocationFailed,
}) {

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  };

  const addPin = ({ latitude, longitude, accuracy }) => {
    const { scale } = mapPosition;
    const newPin = {
      index: pins.length,

      // Position on the user-provided picture
      left: (crosshairsPosition.x - mapPosition.x) / scale,
      top: (crosshairsPosition.y - mapPosition.y) / scale,

      // Position in the real world
      latitude,
      longitude,
      accuracy // in meters
    };
    const newPins = [...pins, newPin];

    setPins(newPins);
    localStorage.setItem('pins', JSON.stringify(newPins));
  };

  const handleConfirmLocation = () => {
    updateUserLocation({
      callback: addPin
    })
    toggleIsSettingLocation();
  };

  const handleUpdateLocation = () => {
    updateUserLocation({ pins });
  }


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
    }

    const loadingZoneContent = () => {
      if (isUpdatingLocation) {
        return (
          <>
            <>🤳</>
            <div className={styles.loadingBarBackground} >
              <div className={`${styles.loadingBar} ${getLoadingBarClass()}`} />
            </div>
            <>🛰</>
          </>
        )
      } else if (updatingLocationFailed) {
        return (
          <div className={styles.failureBar} >
            Poor GPS signal. Try again.
          </div>
        )
      }
      return null;
    };

    return (
      <div className={styles.loadingZoneContainer}>
        {loadingZoneContent()}
      </div>
    )
  };

  return (
    <>
      {showGPSStatusBar()}
      <div className={styles.container}>
        <div className={styles.manageLocation}>
          {isSettingLocation && <button className={styles.button} onClick={handleConfirmLocation}>Confirm</button>}
          {isSettingLocation && <button className={styles.button} onClick={toggleIsSettingLocation}>Cancel</button>}

          {!isSettingLocation && <button className={styles.button} onClick={toggleIsSettingLocation} >
            {!pins.length ? "Set Location" : "Set Another Location"}
          </button>}
          <button className={styles.button} onClick={handleUpdateLocation} >Update Location</button>
        </div>
      </div>
    </>
  );
}