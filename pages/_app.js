import "@/styles/globals.css";
import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";
import UserLocationProvider from "@/contexts/UserLocationContext"; //TODO: Rename this to UserLocationContextProvider

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Trailhead: Navigate Anywhere</title>
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
