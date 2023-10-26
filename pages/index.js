import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/info/hikers");
  }, []);

  return <div></div>;
}
