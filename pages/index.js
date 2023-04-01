import Head from 'next/head';
import MenuTray from '@/components/menu-tray';
import Crosshairs from '@/components/crosshairs';
import dynamic from 'next/dynamic';

import { useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function App() {
  const [isSettingLocation, setIsSettingLocation] = useState(false);

  return (
    <>
      <Head>
        <title>wander: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { isSettingLocation ? <Crosshairs /> : null }
      <Map 
        firstPinCorrdinates={{ top: '100px', left: '100px' }}
      />
      <MenuTray 
        setIsSettingLocation={setIsSettingLocation}
        isSettingLocation={isSettingLocation}
      />
    </>
  )
}