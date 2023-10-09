import React from "react";
import { useRouter } from "next/router";

import HowToSaveOffline from "@/components/HowTo/HowToSaveOffline";
import Button from "@/components/Button/Button";

import styles from "./_offline.module.css";

export default function Offline() {
  const router = useRouter();

  const onClickToNavigate = () => {
    router.push("/navigate");
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h1>This Page is Offline</h1>
      <p>Reload Trailhead when you're connected to cache the site.</p>
      <HowToSaveOffline />
      <div className={styles["return-container"]}>
        <Button onClick={onClickToNavigate} type="clear" size="medium">
          RETURN TO NAVIGATION
        </Button>
      </div>
    </div>
  );
}
