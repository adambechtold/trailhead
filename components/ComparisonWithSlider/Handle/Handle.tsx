import React from "react";

import styles from "./Handle.module.css";

interface Props {
  isDragStarted: boolean;
  onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDragStop: () => void;
  positionLeft: number;
  elementRef: React.RefObject<HTMLDivElement>;
}

export default function Handle({
  isDragStarted,
  onDragStart,
  onDragStop,
  positionLeft,
  elementRef,
}: Props) {
  const classes = [styles["handle"]];
  if (isDragStarted) {
    classes.push(styles["active"]);
  }

  return (
    <div
      ref={elementRef}
      className={classes.join(" ")}
      style={{ left: positionLeft }}
      onMouseDown={onDragStart}
      onMouseUp={onDragStop}
    />
  );
}
