import Head from 'next/head';
import MenuTray from '@/components/menu-tray';
import Crosshairs from '@/components/crosshairs';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function App() {

  return (
    <>
      <Head>
        <title>wander: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map />
      <MenuTray />
    </>
  )
}