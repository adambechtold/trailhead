import styles from '@/components/menu-tray.module.css';

export default function MenuTray({ isSettingLocation, setIsSettingLocation, pins, setPins, crosshairsPosition, mapPosition, userLocation, updateUserLocation, isUpdatingLocation, debugMessage, changeToNextMap, updatingLocationFailed, setUpdatingLocationFailed }) {

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  };

  const addPin = ({ latitude, longitude, accuracy }) => {
    const { scale } = mapPosition;
    const newPin = {
      left: (crosshairsPosition.x - mapPosition.x) / scale,
      top: (crosshairsPosition.y - mapPosition.y) / scale,
      index: pins.length,
      latitude,
      longitude,
      accuracy
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

  const showLoadingBar = () => {
    if (isUpdatingLocation) {
      return (
        <div className={styles.loadingBarContainer} >
          <div className={styles.loadingBar} />
        </div>  
      )
    } else if (updatingLocationFailed) {
      return (
        <div className={styles.loadingBarContainer} >
          <div className={styles.failureBar} >
            Poor GPS signal. Try again.
          </div>
        </div>  
      )
    } else {
      return <div className={styles.loadingBarContainerPlaceholder} />
    }
  };

  return (
    <div className={styles.container}>
      {showLoadingBar()}
      <div className={styles.buttonsContainer}>
        <div className={styles.manageLocation}>
          {debugMessage && <div>{debugMessage}</div>}
          {isSettingLocation && <button className={styles.button} onClick={handleConfirmLocation}>Confirm</button>}
          {isSettingLocation && <button className={styles.button} onClick={toggleIsSettingLocation} >Cancel</button>}

          {!isSettingLocation && <button className={styles.button} onClick={toggleIsSettingLocation} >
            {!pins.length ? "Set Location" : "Set Another Location"}
          </button>}

          <button className={styles.button} onClick={handleUpdateLocation} >Update Location</button>
          {userLocation && <div>latitude: {userLocation && userLocation.latitude}<br />longitude:{userLocation.longitude} <br /> accuracy: {userLocation.accuracy}</div>}
        </div>
        <button className={styles.button} onClick={changeToNextMap}>Next Map</button>
      </div>
    </div>
  );
}
