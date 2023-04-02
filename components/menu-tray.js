import { useState } from 'react';

import styles from '@/components/menu-tray.module.css';

export default function MenuTray({ isSettingLocation, setIsSettingLocation, pins, setPins, crosshairsPosition, mapPosition }) {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  };

  const handleConfirmLocation = () => {
    addPin();
    toggleIsSettingLocation();
  };

  const updateUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }, (error) => {
      console.log(error);
    });
}

  const addPin = () => {
    const { scale } = mapPosition;

    updateUserLocation();

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

  return (
    <div className={styles.container}>
      {isSettingLocation && <button onClick={handleConfirmLocation}>Confirm</button>}
      {isSettingLocation && <button onClick={toggleIsSettingLocation} >Cancel</button>}

      {!isSettingLocation && <button onClick={toggleIsSettingLocation} >
        {!pins.length ? "Set Location" : "Set Another Location"}
      </button>}
      
      <button onClick={updateUserLocation} >Update Location | latitude: {latitude}, longitude{longitude}</button>
    </div>
  );
}
