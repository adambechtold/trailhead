// TODO: Refactor this component.
// Its implementation is very messy.

import React, { useRef } from "react";

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

const setGlowBackground = (
  glowRef: React.RefObject<HTMLDivElement>,
  error: boolean,
  accuracy?: number
) => {
  if (!glowRef.current) return;
  const glow = glowRef.current;

  const getBackgroundAttribute = (color: string) =>
    `radial-gradient(closest-side, ${color}, transparent)`;

  if (error) {
    glow.style.background = getBackgroundAttribute("var(--error-color)");
    return;
  }

  if (!accuracy) {
    glow.style.background = getBackgroundAttribute(
      "var(--clear-button-background-color)"
    );
    return;
  }
  glow.style.background = getBackgroundAttribute(
    `var(--${getThresholdName(accuracy)})`
  );
};

type Props = {
  accuracy?: number; // in meters
  isUpdating?: boolean;
  error: boolean;
};

export default function AccuracyIndicator({
  accuracy,
  isUpdating,
  error,
}: Props) {
  const glowRef = useRef<HTMLDivElement>(null);
  setGlowBackground(glowRef, !!error, accuracy);

  const glowClassName = [
    styles["accuracy-updating-glow"],
    isUpdating ? styles["spin"] : "",
  ].join(" ");

  if (glowRef.current && !isUpdating) {
    glowRef.current.style.background = "";
  }

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
