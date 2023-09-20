import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push("/how-to-use");
  }, []);

  return <div></div>;
}
