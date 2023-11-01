import React from "react";

import PictureGuidelines from "./PictureGuidelines";

import styles from "./HowToUse.module.css";

export default function HowToUse() {
  return (
    <div className={styles.container}>
      <h2>How to Use Trailhead</h2>
      <ol className={styles["main-step"]}>
        <li className={styles["main-step"]}>
          <span className={styles["title"]}>
            📸 Take a picture of a trail map
          </span>
          <p>Make sure that...</p>
          <PictureGuidelines />
        </li>
        <li>
          <span className={styles["title"]}>📍 Pin your current location</span>
          <p>
            Click <b>Set Pin</b> and position the crosshairs over your current
            location.
          </p>
        </li>
        <li>
          <span className={styles["title"]}>📍 Pin another location</span>
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
          <span className={styles["title"]}>🗺️ Enjoy your hike!</span>
          <p>
            You've successfully configured your map! View it any time to see
            your current position.
          </p>
        </li>
      </ol>
      <h3 className={styles["h3-title"]}>Increase accuracy as you hike</h3>
      <p>
        If you notice your location is incorrect, just keep adding more pins.
      </p>
      <p>
        Trailhead uses all the pins to find your location and places more weight
        on the pin closets to you.
      </p>
      <h3 className={styles["h3-title"]}>Reset Configuration</h3>
      <p>Placed a pin incorrectly? You have two options:</p>
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
