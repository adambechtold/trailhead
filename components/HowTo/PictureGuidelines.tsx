import React from "react";

import styles from "./PictureGuidelines.module.css";

export default function PictureGuidlines() {
  return (
    <div className={styles.container}>
      <ul>
        <li>North is up</li>
        <li>Proportions are to scale</li>
        <li>
          The photo is perpendicular to the trailmap, not from either side or
          skewed
        </li>
      </ul>
    </div>
  );
}
