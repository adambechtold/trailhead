import React from "react";
import { useRouter } from "next/router";

import Button from "@/components/Buttons/Button";
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
        <Button
          onClick={onClickToNavigate}
          type="gradient-primary"
          size="medium"
        >
          Start Navigating
        </Button>
      </div>
    </div>
  );
}
