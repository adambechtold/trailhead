import { useState } from 'react';

import styles from '@/components/menu-tray.module.css';

export default function MenuTray({ isSettingLocation, setIsSettingLocation, pins, setPins, crosshairsPosition, mapPosition }) {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  };

  const updateUserLocation = ({ callback }) => {
    setIsUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setIsUpdatingLocation(false);
      if (callback) callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, (error) => {
      console.log(error);
      setIsUpdatingLocation(false);
    });
  }

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

  return (
    <div className={styles.container}>
      {isSettingLocation && <button onClick={handleConfirmLocation}>Confirm</button>}
      {isSettingLocation && <button onClick={toggleIsSettingLocation} >Cancel</button>}

      {!isSettingLocation && <button onClick={toggleIsSettingLocation} >
        {!pins.length ? "Set Location" : "Set Another Location"}
      </button>}

      <button onClick={updateUserLocation} >Update Location | latitude: {latitude}, longitude{longitude} | updating? {isUpdatingLocation ? "yes" : "no"}</button>
    </div>
  );
}
