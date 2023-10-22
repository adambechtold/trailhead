import React from "react";

import InterpolateMap from "@/components/InterpolateMap";

import styles from "./RejectMapFile.module.css";
import Button from "@/components/Buttons/Button";

type Props = {
  previewSrc: string;
  onConfirmRejection: () => void;
};

export default function RefectMapFile({
  previewSrc,
  onConfirmRejection,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles["overlay"]}>
        <div className={styles["message"]}>
          <div className={styles.section}>
            <h2>This map exceeds the storage limits</h2>
            <p>
              Choose another one that fits within the remaining storage and/or
              delete other maps to make room.
            </p>
          </div>
          <div className={styles.section}>
            <h3>How to Reduce File Size</h3>
            <p>Create smaller photos by...</p>
            <ol>
              <li>Take a Photo with the normal camera app</li>
              <li>Return to Trailhead and Click "Add Map"</li>
              <li>
                Select a Photo from your <strong>Photo Library</strong> and{" "}
                <strong>Select the Reduced File Size</strong>
              </li>
            </ol>
          </div>
        </div>
        <div className={styles["button-container"]}>
          <Button onClick={onConfirmRejection} type="clear" size="medium">
            OK
          </Button>
        </div>
      </div>
      <InterpolateMap mapURL={previewSrc} />
    </div>
  );
}
