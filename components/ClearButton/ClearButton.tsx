import React from "react";

import styles from "./ClearButton.module.css";

type Size = "small" | "medium";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  size?: "small" | "medium";
};

export default function ClearButton({
  onClick,
  children,
  size = "medium",
}: Props) {
  const sizeClass = styles[`size-${size}`];
  return (
    <button
      className={[styles.container, sizeClass].join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
