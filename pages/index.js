import Head from 'next/head';
// TODO: Make the menu tray ssr. It doesn't need to be client-side rendered.
// It is that way now for debugging.
import MenuTray from '@/components/menu-tray';
import Crosshairs from '@/components/crosshairs';
import dynamic from 'next/dynamic';

import { useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function App() {
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [crosshairsPosition, setCrosshairsPosition] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0, scale: 0.4 }); // TODO: calculate initial scale
  const [pins, setPins] = useState([]);

  return (
    <>
      <Head>
        <title>wander: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isSettingLocation && <Crosshairs setCrosshairsPosition={setCrosshairsPosition} />}
      <Map
        pins={pins}
        setMapPosition={setMapPosition}
        mapPosition={mapPosition}
      />
      <MenuTray
        isSettingLocation={isSettingLocation}
        setIsSettingLocation={setIsSettingLocation}
        pins={pins}
        setPins={setPins}
        crosshairsPosition={crosshairsPosition}
        mapPosition={mapPosition}
      />
    </>
  );
}