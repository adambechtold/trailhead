import Head from 'next/head';
import Map from '@/components/map';

export default function App() {
  return (
    <>
      <Head>
        <title>wander: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map />
    </>
  )
}