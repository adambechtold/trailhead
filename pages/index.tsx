import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/info/hikers");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redirect once on mount
  }, []);

  return <div></div>;
}
