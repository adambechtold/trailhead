import { useState } from 'react';

import ManageMap from '@/components/ManageMap';
import DisplayMapData from '@/components/debug/DisplayMapData';
import Console from '@/components/debug/Console';

import styles from '@/components/MenuTray.module.css';

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
  showDebuggingContent,
  setShowDebuggingContent,
  mapFunctionParameters,
  debugStatements,
}) {

  const [showConsole, setShowConsole] = useState(false);
  const toggleConsole = () => { setShowConsole(!showConsole) };

  return (
    <div className={`${styles.container} ${showDebuggingContent ? styles.expanded : styles.contracted}`}>
      <button onClick={() => setShowDebuggingContent(!showDebuggingContent)} className={styles.inspectDataButton}>Inspect Data</button>
      {!showDebuggingContent &&
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
        />}
      {showDebuggingContent &&
        <div className={styles.debugContainer}>
          {!showConsole && <DisplayMapData
            pins={pins}
            userLocation={userLocation}
            mapFunctionParameters={mapFunctionParameters}
          />}
          {showConsole && <Console debugStatements={debugStatements} />}
          {showDebuggingContent && <button onClick={toggleConsole} className={styles.consoleButton}>Console</button>}
        </div>}

    </div>
  );
}
