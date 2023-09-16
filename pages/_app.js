import "@/styles/globals.css";
import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";
import UserLocationProvider from "@/contexts/UserLocationContext"; //TODO: Rename this to UserLocationContextProvider

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Trailhead: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapContextProvider>
        <UserLocationProvider>
          <Component {...pageProps} />
        </UserLocationProvider>
      </MapContextProvider>
    </>
  );
}
