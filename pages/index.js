import { useState, useEffect } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import Toolbar from "@/components/Toolbar";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const maps = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trail-map-smaller.jpeg",
  "/images/bartlett-neighborhood.jpeg",
  "/images/bartlett-closeup.jpeg",
];

export default function App() {
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [crosshairsPosition, setCrosshairsPosition] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0, scale: 0.4 }); // TODO: calculate initial scale
  const [pins, setPins] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(100); // in meters
  const [updatingLocationFailed, setUpdatingLocationFailed] = useState(false);
  const [mapFile, setMapFile] = useState(maps[0]);
  const [debugStatements, setDebugStatements] = useState([]); // [{ message: '', time: new Date() }]
  const addDebugStatement = (message) => {
    setDebugStatements((debugStatements) => [
      ...debugStatements,
      { message, time: new Date() },
    ]);
  };
  const [showDebuggingContent, setShowDebuggingContent] = useState(false);

  // Update Pins
  useEffect(() => {
    const pinsFromStorage = JSON.parse(localStorage.getItem("pins"));
    if (pinsFromStorage) {
      setPins(pinsFromStorage);
    }
  }, []);

  const resetPins = () => {
    setPins([]);
    localStorage.setItem("pins", JSON.stringify([]));
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
  };

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 100,
      });
    });
  }

  async function updateUserLocation({ callback, pins }) {
    setIsUpdatingLocation(true);
    const numberOfRetries = 10;

    for (let i = 0; i < numberOfRetries; i++) {
      const position = await getCurrentPosition();
      const { top, left } = convertUserLocationToMapPosition({
        pins,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLocationAccuracy(position.coords.accuracy);
      const miniumumAccuracy = 5; // change minium accuracy based on device

      if (position.coords.accuracy > miniumumAccuracy) {
        // accuracy is too low (must be updated to trial on desktop)
        const message = `Retry Accuracy. \t\t\tRecorded accuracy: ${position.coords.accuracy} > \t\t\t Minimum Accuracy: ${miniumumAccuracy}`;
        addDebugStatement(message);
        await delay(1300);
      } else {
        const message = `Use Accuracy. \t\t\tRecorded accuracy: ${position.coords.accuracy} > \t\t\t Minimum Accuracy: ${miniumumAccuracy}`;
        addDebugStatement(message);
        setUserLocation({
          top,
          left,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsUpdatingLocation(false);
        if (callback)
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        return;
      }
    }
    setIsUpdatingLocation(false);
  }

  // returns Top and Left of the User
  function convertUserLocationToMapPosition({ pins, latitude, longitude }) {
    if (pins.length < 2) {
      const empty = () => ({ top: null, left: null });
      return empty();
    }

    // TODO: Use more than 2 pins
    const pin1 = pins[0];
    const pin2 = pins[1];

    if (pin1.latitude === pin2.latitude || pin1.longitude === pin2.longitude) {
      console.log("reset and move");
      addDebugStatement(
        "lat and long are the same; reset and move; for now, adjusting so you can see something"
      );
      // for debugging
      pin1.latitude = pin2.latitude + 0.000002;
      pin1.longitude = pin2.longitude + 0.000002;
      // return empty();
    }

    const offsetX =
      (-1 * (pin1.left * pin2.latitude - pin2.left * pin1.latitude)) /
      (pin1.latitude - pin2.latitude);
    const offsetY =
      (-1 * (pin1.top * pin2.longitude - pin2.top * pin1.longitude)) /
      (pin1.longitude - pin2.longitude);

    const scalerX = (pin1.left - offsetX) / pin1.latitude;
    const scalerY = (pin1.top - offsetY) / pin1.longitude;

    setMapFunctionParameters({ offsetX, offsetY, scalerX, scalerY });

    if (isNaN(offsetX) || isNaN(offsetY) || isNaN(scalerX) || isNaN(scalerY)) {
      console.log("offset or scaler is NaN");
      addDebugStatement("offset or scaler is NaN");
      return empty();
    }

    if (offsetX === 0 || offsetY === 0 || scalerX === 0 || scalerY === 0) {
      console.log("offset or scaler is 0");
      addDebugStatement("offset or scaler is 0");
      return empty();
    }

    if (
      offsetX === Infinity ||
      offsetY === Infinity ||
      scalerX === Infinity ||
      scalerY === Infinity
    ) {
      console.log("offset or scaler is Infinity");
      addDebugStatement("offset or scaler is Infinity");
      return empty();
    }

    console.log("offsetX", offsetX, "scaleX", scalerX);
    console.log("offsetY", offsetY, "scaleY", scalerY);

    const x = latitude * scalerX + offsetX;
    const y = longitude * scalerY + offsetY;

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
    longitude: -72.68212145013308,
  };

  const locationUpperLeftCorner = {
    latitude: 41.34219478336026,
    //longitude: -72.68409832212741
    longitude: -72.6835,
  };

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
      <Toolbar
        changeToNextMap={changeToNextMap}
        pins={pins}
        resetCurrentMap={resetCurrentMap}
      />
      {isSettingLocation && (
        <Crosshairs setCrosshairsPosition={setCrosshairsPosition} />
      )}
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
        updatingLocationFailed={updatingLocationFailed}
        setUpdatingLocationFailed={setUpdatingLocationFailed}
        locationAccuracy={locationAccuracy}
        showDebuggingContent={showDebuggingContent}
        setShowDebuggingContent={setShowDebuggingContent}
        debugStatements={debugStatements}
      />
    </>
  );
}
