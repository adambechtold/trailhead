import { useState } from "react";

import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";
import UserLocationProvider from "@/contexts/UserLocationContext";
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

  const resetCurrentMap = () => {
    setIsSettingLocation(false);
  };

  return (
    <>
      <Head>
        <title>Trailhead: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapContextProvider>
        <UserLocationProvider>
          <Toolbar resetCurrentMap={resetCurrentMap} />
          {isSettingLocation && (
            <Crosshairs setCrosshairsPosition={setCrosshairsPosition} />
          )}
          <CurrentMap />
          <MenuTray
            isSettingLocation={isSettingLocation}
            setIsSettingLocation={setIsSettingLocation}
            crosshairsPosition={crosshairsPosition}
          />
        </UserLocationProvider>
      </MapContextProvider>
    </>
  );
}
