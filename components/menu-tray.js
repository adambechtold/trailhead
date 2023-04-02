import styles from '@/components/menu-tray.module.css';

export default function MenuTray({ isSettingLocation, setIsSettingLocation, pins, setPins, crosshairsPosition, mapPosition, userLocation, updateUserLocation, isUpdatingLocation, debugMessage, changeToNextMap }) {

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  };

  const addPin = ({ latitude, longitude }) => {
    const { scale } = mapPosition;

    setPins([
      ...pins,
      {
        left: (crosshairsPosition.x - mapPosition.x) / scale,
        top: (crosshairsPosition.y - mapPosition.y) / scale,
        index: pins.length,
        latitude,
        longitude
      }
    ]);
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

  return (
    <div className={styles.container}>
      <div className={styles.manageLocation}>
        {debugMessage && <div>{debugMessage}</div>}
        {isSettingLocation && <button className={styles.button} onClick={handleConfirmLocation}>Confirm</button>}
        {isSettingLocation && <button className={styles.button} onClick={toggleIsSettingLocation} >Cancel</button>}

        {!isSettingLocation && <button className={styles.button} onClick={toggleIsSettingLocation} >
          {!pins.length ? "Set Location" : "Set Another Location"}
        </button>}

        <button className={styles.button} onClick={handleUpdateLocation} >Update Location</button>
        {userLocation && <div>latitude: {userLocation && userLocation.latitude}, longitude{userLocation.longitude}</div>}
        <div>updating? {isUpdatingLocation ? "yes" : "no"}</div>
      </div>
      <button className={styles.button} onClick={changeToNextMap}>Next Map</button>
    </div>
  );
}
