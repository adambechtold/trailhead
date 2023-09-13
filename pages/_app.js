import "@/styles/globals.css";
import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Trailhead: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapContextProvider>
        <Component {...pageProps} />
      </MapContextProvider>
    </>
  );
}
