import ManageMap from '@/components/manageMap';

import styles from '@/components/menu-tray.module.css';

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
  debugMessage, 
  updatingLocationFailed, 
  locationAccuracy,
  showDebuggingContent,
  setShowDebuggingContent
}) {

  return (
    <div className={`${styles.container} ${showDebuggingContent ? styles.expanded : styles.contracted}`}>
      <button onClick={() => setShowDebuggingContent(!showDebuggingContent)} className={styles.inspectDataButton}>Inspect Data</button>
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
    </div>
  );
}
