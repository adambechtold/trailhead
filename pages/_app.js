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
        <link rel="icon" href="/favicon.ico" />
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
