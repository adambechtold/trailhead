import React from "react";

import PictureGuidlines from "./PictureGuidelines";

import styles from "./HowToUse.module.css";

export default function HowToUse() {
  return (
    <div className={styles.container}>
      <h2>How to Use Trailhead</h2>
      <ol className={styles["main-step"]}>
        <li className={styles["main-step"]}>
          <span className={styles["title"]}>
            📸 Take a Picture of a Trailmap
          </span>
          <p>Make sure that...</p>
          <PictureGuidlines />
        </li>
        <li>
          <span className={styles["title"]}>📍 Pin Your Current Location</span>
          <p>
            Click <b>Set Pin</b> and position the crosshairs over your current
            location.
          </p>
        </li>
        <li>
          <span className={styles["title"]}>📍 Pin Another Location</span>
          <p>
            <b>Walk a short distance</b> to a spot that's clearly marked on the
            map, <i>for example, walk to the first fork in the trail</i>.
          </p>
          <p>
            Click <b>Set Pin</b> again and place the pin on your current
            location.
          </p>
        </li>
        <li>
          <span className={styles["title"]}>🗺️ Enjoy Your Hike!</span>
          <p>
            You've succesfully configured your map! View it any time to see your
            current position.
          </p>
        </li>
      </ol>
      <h3 className={styles["h3-title"]}>Reset Configuration</h3>
      <p>Need to adjust your pins? You have two options:</p>
      <ul className={styles["reset-options"]}>
        <li>
          Click <b>Reset Pins</b> to remove both pins.
        </li>
        <li>
          Go the the <b>Inspect Data</b> page to remove specific pins.
        </li>
      </ul>
    </div>
  );
}
