import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";
import UserLocationProvider from "@/contexts/UserLocationContext"; //TODO: Rename this to UserLocationContextProvider
import CreatePinContextProvider from "@/contexts/CreatePinContext";
import dynamic from "next/dynamic";

import MenuTray from "@/components/MenuTray";
import Crosshairs from "@/components/Crosshairs";
import Toolbar from "@/components/Toolbar";

const CurrentMap = dynamic(() => import("@/components/CurrentMap"), {
  ssr: false,
});

export default function App() {
  return (
    <>
      <Head>
        <title>Trailhead: Always Find Your Way</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapContextProvider>
        <UserLocationProvider>
          <CreatePinContextProvider>
            <Toolbar />
            <Crosshairs />
            <CurrentMap />
            <MenuTray />
          </CreatePinContextProvider>
        </UserLocationProvider>
      </MapContextProvider>
    </>
  );
}
