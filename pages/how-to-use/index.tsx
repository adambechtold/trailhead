import React from "react";
import { useRouter } from "next/router";
import { useUserAgreementContext } from "@/contexts/UserAgreementContext";

import ClearButton from "@/components/ClearButton/ClearButton";

import styles from "./index.module.css";

export default function HowToUsePage() {
  const router = useRouter();
  const { hasAgreedToUserAgreement, setHasAgreedToUserAgreement } =
    useUserAgreementContext();

  const onClickToNavigate = () => {
    router.push("/navigate");
  };

  const onAgreeToUserAgreement = () => {
    setHasAgreedToUserAgreement(true);
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Trailhead</h1>
      <p>Use Trailhead to turn pictures of trailmaps into GPS-enabled maps.</p>
      <h2>How to Use</h2>
      <ol>
        <li>
          Take a Picture of a Trailmap
          <p>Make sure that...</p>
          <ul>
            <li>North is up</li>
            <li>
              The photo is perpendicular to the trailmap, not from either side
              or skewed
            </li>
            <li>The map proportions are to scale</li>
            <li>The image of the map is clear</li>
          </ul>
        </li>
        <li>
          Set Your Current Location
          <ul>
            <li>
              Click <b>Set Pin</b> and position the crosshairs over your current
              location.
            </li>
            <li>
              The app will only set your pin if it can get an accurate location.
              If it fails, try again. Location accuracy increases over time.
            </li>
          </ul>
        </li>
        <li>
          Pin Another Location
          <p>
            Walk a short distance to a spot that's clearly marked on the map,{" "}
            <i>for example, walk to the first intersection</i>.
          </p>
          <ul>
            <li>
              Click <b>Set Pin</b> again and place the pin on your current
              location.
            </li>
          </ul>
        </li>
        <li>
          Enjoy Your Hike!
          <p>
            You've succesfully configured your map! Any time you want to see
            your location, click <b>Update Location</b>. (Constantly updated
            position should be available tomorrow, 09/19).
          </p>
        </li>
      </ol>
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

      {hasAgreedToUserAgreement && (
        <div className={styles["button-container"]}>
          <ClearButton onClick={onClickToNavigate}>
            START NAVIGATING
          </ClearButton>
        </div>
      )}
      {!hasAgreedToUserAgreement && (
        <div className={styles["button-container"]}>
          <ClearButton onClick={onAgreeToUserAgreement}>
            I UNDERSTAND
          </ClearButton>
        </div>
      )}
    </div>
  );
}
