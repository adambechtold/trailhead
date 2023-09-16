import React, { useEffect } from "react";
import { useRouter } from "next/router";
// TODO route the user based on what's stored locally.

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push("/navigate");
  }, []);

  return <div></div>;
}
