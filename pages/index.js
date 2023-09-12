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
        console.log(message);
        await delay(1300);
      } else {
        const message = `Use Accuracy. \t\t\tRecorded accuracy: ${position.coords.accuracy} > \t\t\t Minimum Accuracy: ${miniumumAccuracy}`;
        console.log(message);
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

  return (
    <>
      <Head>
        <title>Trailhead: Always Find Your Way</title>
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
      />
    </>
  );
}
