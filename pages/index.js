import Head from 'next/head';
import Map from '@/components/map';
import MenuTray from '@/components/menu-tray';

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