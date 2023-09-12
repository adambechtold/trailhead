import { useState, useEffect } from "react";

import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";
import dynamic from "next/dynamic";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import Toolbar from "@/components/Toolbar";

const CurrentMap = dynamic(() => import("@/components/CurrentMap"), {
  ssr: false,
});

export default function App() {
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [crosshairsPosition, setCrosshairsPosition] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0, scale: 0.4 }); // TODO: calculate initial scale
  const [pins, setPins] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(100); // in meters
  const [updatingLocationFailed, setUpdatingLocationFailed] = useState(false);

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
    // TODO: let's move this into a Context object
    // Position: This should only get the current position in long/lat
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
      <MapContextProvider>
        <Toolbar pins={pins} resetCurrentMap={resetCurrentMap} />
        {isSettingLocation && (
          <Crosshairs setCrosshairsPosition={setCrosshairsPosition} />
        )}
        {/* <Map
          mapFile={mapFile}
          pins={pins}
          setMapPosition={setMapPosition}
          mapPosition={mapPosition}
          userLocation={userLocation}
        /> */}
        <CurrentMap
          start={pins.length > 0 ? pins[0] : null}
          end={pins.length > 1 ? pins[1] : null}
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
      </MapContextProvider>
    </>
  );
}
