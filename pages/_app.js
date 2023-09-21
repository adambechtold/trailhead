import "@/styles/globals.css";
import { useRouter } from "next/router";
import Head from "next/head";
import MapContextProvider from "@/contexts/MapContext";
import UserLocationProvider from "@/contexts/UserLocationContext"; //TODO: Rename this to UserLocationContextProvider
import UserAgreementContextProvider, {
  useUserAgreementContext,
} from "@/contexts/UserAgreementContext";
import { useEffect } from "react";

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
      <MapContextProvider>
        <UserLocationProvider>
          <UserAgreementContextProvider>
            <>
              <CheckUserAgreement />
              <Component {...pageProps} />
            </>
          </UserAgreementContextProvider>
        </UserLocationProvider>
      </MapContextProvider>
    </>
  );
}

function CheckUserAgreement() {
  const router = useRouter();
  const { hasAgreedToUserAgreement } = useUserAgreementContext();

  useEffect(() => {
    if (!hasAgreedToUserAgreement) {
      router.push({ pathname: "/how-to-use", query: { disclaimer: "true" } });
    }
  }, [hasAgreedToUserAgreement]);

  return <></>;
}
