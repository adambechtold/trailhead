import React from "react";
import { useRouter } from "next/router";

import { useUserAgreementContext } from "@/contexts/UserAgreementContext";

import styles from "./index.module.css";
import Button from "@/components/Button/Button";

export default function DisclaimerPage() {
  const router = useRouter();
  const { hasAgreedToUserAgreement, setHasAgreedToUserAgreement } =
    useUserAgreementContext();

  const onAgreeToUserAgreement = () => {
    setHasAgreedToUserAgreement(true);
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Trailhead</h1>
      <p>Use Trailhead to turn pictures of trailmaps into GPS-enabled maps.</p>
      <div className={styles["section-container"]}>
        <h2>Warning: Saved maps can disappear</h2>
        <p>
          Maps are saved to your browser's local storage. That means they will
          disappear if you clear your browing data.
        </p>
      </div>
      <div className={styles["section-container"]}>
        <h2>⚠️Warning: Do not rely on Trailhead for accurate navigation⚠️</h2>
        <p>
          <b>
            Trailhead is experiemental and not guaranteed to provide accurate
            navigation.
          </b>{" "}
          It has not been thoroughly tested and the accuracy of its information
          depends heavily on the quality of the trailmap image you provide, the
          accuracy of your GPS measurements, and the accuracy of your placement
          of pins. The app does not have a method of guaranteeing its accuracy
          and correct use.
        </p>
        <p>
          <b>
            Use use Trailhead as a supplmental tool. Do not hike without other
            navigation resources.
          </b>
        </p>
      </div>
      <div className={styles["button-container"]}>
        {!hasAgreedToUserAgreement && (
          <Button onClick={onAgreeToUserAgreement}>I UNDERSTAND</Button>
        )}
        {hasAgreedToUserAgreement && (
          <>
            <Button onClick={() => router.push("/navigate")}>
              START NAVIGATING
            </Button>
            <Button onClick={() => router.push("/how-to-use")}>
              HOW TO USE TRAILHEAD
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
