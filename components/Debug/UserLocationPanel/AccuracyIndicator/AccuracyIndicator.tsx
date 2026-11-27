// TODO: Refactor this component.
// Its implementation is very messy.

import React from "react";

import styles from "./AccuracyIndicator.module.css";

type AccuracyThreshold = [number, string];

const accuracyThresholds: AccuracyThreshold[] = [
  [10, "accuracy-very-good"],
  [20, "accuracy-good"],
  [50, "accuracy-ok"],
  [Infinity, "accuracy-bad"],
];
const getThresholdName = (threshold: number) => {
  return accuracyThresholds.filter((t) => t[0] >= threshold)[0][1];
};

const getAccuracyClass = (error: boolean, accuracy?: number) => {
  if (error) return styles["accuracy-error"];
  if (!accuracy) return "";
  const className = getThresholdName(accuracy);
  return styles[className];
};

type Props = {
  accuracy?: number; // in meters
  isUpdating?: boolean;
  error: boolean;
};

export default function AccuracyIndicator({ accuracy, error }: Props) {
  return (
    <div className={styles.container}>
      <div
        className={[styles.content, getAccuracyClass(error, accuracy)].join(
          " "
        )}
      >
        Accuracy: {accuracy ? accuracy.toFixed(1) + "m" : "X"}
      </div>
    </div>
  );
}
