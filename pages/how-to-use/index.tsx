import React from "react";
import { useRouter } from "next/router";

import ClearButton from "@/components/ClearButton/ClearButton";
import HowToUse from "@/components/HowTo/HowToUse";

import styles from "./index.module.css";

export default function HowToUsePage() {
  const router = useRouter();

  const onClickToNavigate = () => {
    router.push("/navigate");
  };

  return (
    <div className={styles.container}>
      <HowToUse />
      <div className={styles["button-container"]}>
        <ClearButton onClick={onClickToNavigate}>START NAVIGATING</ClearButton>
      </div>
    </div>
  );
}
