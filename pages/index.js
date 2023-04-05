import { useState, useEffect } from 'react';

import Head from 'next/head';
import dynamic from 'next/dynamic';

import MenuTray from '@/components/menu-tray';
import Crosshairs from '@/components/crosshairs';
import styles from '@/styles/index.module.css'

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

const maps = [
  '/images/trail-map-smaller.jpeg',
  '/images/bartlett-neighborhood.jpeg',
  '/images/bartlett-closeup.jpeg',
];

export default function App() {
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [crosshairsPosition, setCrosshairsPosition] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0, scale: 0.4 }); // TODO: calculate initial scale
  const [pins, setPins] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  const [mapFile, setMapFile] = useState(maps[0]);

  // Update Pins
  useEffect(() => {
    const pinsFromStorage = JSON.parse(localStorage.getItem('pins'));
    if (pinsFromStorage) {
      setPins(pinsFromStorage);
    } 
  }, []);

  const resetPins = () => {
    setPins([]);
    localStorage.setItem('pins', JSON.stringify([]));
  };

  // Next Map
  const changeToNextMap = () => {
    const index = maps.indexOf(mapFile);
    if (index === maps.length - 1) {
      setMapFile(maps[0]);
    } else {
      setMapFile(maps[index + 1]);
    }
    resetCurrentMap();
  };

  const resetCurrentMap = () => {
    resetPins();
    setUserLocation(null);
    setIsSettingLocation(false);
    setDebugMessage('');
  }

  const updateUserLocation = ({ callback, pins, startUpdatingTime }) => {
    setIsUpdatingLocation(true);
    const now = new Date();
    if (startUpdatingTime === undefined) {
      startUpdatingTime = now;
    } else {
      const differenceInTime = now.getTime() - startUpdatingTime.getTime();
      if (differenceInTime > 6000) {
        // TODO: Make it clear to the user that the operation failed
        setIsUpdatingLocation(false);
        return;
      }
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { top, left } = (pins && pins.length >= 2) ?
        convertUserLocationToMapPosition({ pins, latitude: position.coords.latitude, longitude: position.coords.longitude })
        : { top: null, left: null };

      if (position.coords.accuracy > 10) { // accuracy is too low (must be updated to trial on desktop)
        setTimeout(() => updateUserLocation({ callback, pins, startUpdatingTime }), 1000);
        return;
      } else {
        setUserLocation({
          top,
          left,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setIsUpdatingLocation(false);
        if (callback) callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      }
    }, (error) => {
      console.log(error);
      setIsUpdatingLocation(false);
    }, { enableHighAccuracy: true, maximumAge: 100 });
  }


  // returns Top and Left of the User
  function convertUserLocationToMapPosition({ pins, latitude, longitude }) {
    const empty = () => ({ top: null, left: null });

    if (pins.length < 2) {
      return empty();
    };

    // TODO: Use more than 2 pins
    const pin1 = pins[0];
    const pin2 = pins[1];

    if (pin1.latitude === pin2.latitude || pin1.longitude === pin2.longitude) {
      console.log('reset and move');
      setDebugMessage('lat and long are the same; reset and move; for now, adjusting so you can see something');
      // for debugging
      pin1.latitude = pin2.latitude + 0.000002;
      pin1.longitude = pin2.longitude + 0.000002;
      // return empty();
    };

    const offsetX = -1 * ((pin1.left * pin2.latitude) - (pin2.left * pin1.latitude)) / (pin1.latitude - pin2.latitude);
    const offsetY = -1 * ((pin1.top * pin2.longitude) - (pin2.top * pin1.longitude)) / (pin1.longitude - pin2.longitude);

    const scalerX = ((pin1.left - offsetX) / pin1.latitude);
    const scalerY = ((pin1.top - offsetY) / pin1.longitude);

    if (isNaN(offsetX) || isNaN(offsetY) || isNaN(scalerX) || isNaN(scalerY)) {
      console.log('offset or scaler is NaN');
      setDebugMessage('offset or scaler is NaN');
      return empty();
    }

    if (offsetX === 0 || offsetY === 0 || scalerX === 0 || scalerY === 0) {
      console.log('offset or scaler is 0');
      setDebugMessage('offset or scaler is 0');
      return empty();
    }

    if (offsetX === Infinity || offsetY === Infinity || scalerX === Infinity || scalerY === Infinity) {
      console.log('offset or scaler is Infinity');
      setDebugMessage('offset or scaler is Infinity');
      return empty();
    }

    console.log('offsetX', offsetX, 'scaleX', scalerX);
    console.log('offsetY', offsetY, 'scaleY', scalerY);

    const x = (latitude * scalerX) + offsetX;
    const y = (longitude * scalerY) + offsetY;

    return { left: x, top: y };
  }

  // ======================= TESTING =======================
  // parking lot
  // 41.336736849249846, -72.68162289645365

  // lookout
  // 41.33830117867603, -72.68210606267384

  // in between parking lot and lookout
  // 41.33736535834985, -72.68212145013308

  // top left corner of lake
  // 41.34219478336026, -72.68409832212741

  const locationBetweenLookoutAndParkingLot = {
    latitude: 41.33736535834985,
    longitude: -72.68212145013308
  }

  const locationUpperLeftCorner = {
    latitude: 41.34219478336026,
    //longitude: -72.68409832212741
    longitude: -72.6835
  }

  // const [pins, setPins] = useState([
  //   // parking lot
  //   {
  //     index: 0,
  //     left: 445.977,
  //     top: 918.485,
  //     latitude: 41.336736849249846,
  //     longitude: -72.68162289645365,
  //   },
  //   // lookout
  //   {
  //     index: 1,
  //     left: 421.052,
  //     top: 842.589,
  //     latitude: 41.33830117867603,
  //     longitude: -72.68210606267384,
  //   },
  //   // in between parking lot and lookout (actual)
  //   {
  //     index: 3,
  //     left: 423,
  //     top: 878,
  //     latitude: 41.33736535834985,
  //     longitude: -72.68212145013308
  //   },
  //   // top left corner of lake (actual)
  //   {
  //     index: 4,
  //     left: 335,
  //     top: 630,
  //     latitude: 41.34219478336026,
  //     longitude: -72.68409832212741
  //   }
  // ]);

  return (
    <>
      <Head>
        <title>wander: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {pins.length > 0 && <button className={styles.resetButton} onClick={resetCurrentMap}>Reset Pins</button>}
      {isSettingLocation && <Crosshairs setCrosshairsPosition={setCrosshairsPosition} />}
      <Map
        mapFile={mapFile}
        pins={pins}
        setMapPosition={setMapPosition}
        mapPosition={mapPosition}
        userLocation={userLocation}
      />
      <MenuTray
        isSettingLocation={isSettingLocation}
        setIsSettingLocation={setIsSettingLocation}
        pins={pins}
        setPins={setPins}
        crosshairsPosition={crosshairsPosition}
        mapPosition={mapPosition}
        userLocation={userLocation}
        updateUserLocation={updateUserLocation}
        isUpdatingLocation={isUpdatingLocation}
        debugMessage={debugMessage}
        changeToNextMap={changeToNextMap}
      />
    </>
  );
}
