import "@/styles/globals.css";
import dynamic from "next/dynamic";
import Head from "next/head";
import UserLocationProvider from "@/contexts/UserLocationContext"; //TODO: Rename this to UserLocationContextProvider
import UserAgreementContextProvider from "@/contexts/UserAgreementContext";

const MapContextProvider = dynamic(() => import("@/contexts/MapContext"), {
  ssr: false,
});

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Trailhead: Navigate Anywhere</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#3478f6"
        />
        <meta name="msapplication-TileColor" content="#3478f6" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <UserLocationProvider>
        <UserAgreementContextProvider>
          <MapContextProvider>
            <main className={inter.className}>
              <Component {...pageProps} />
            </main>
          </MapContextProvider>
        </UserAgreementContextProvider>
      </UserLocationProvider>
    </>
  );
}
