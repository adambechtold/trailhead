import React from "react";

import styles from "./ClearButton.module.css";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  size?: "small" | "medium";
  disabled?: boolean;
};

export default function ClearButton({
  onClick,
  children,
  size = "medium",
  disabled = false,
}: Props) {
  const sizeClass = styles[`size-${size}`];
  const contentClass = [styles.content, disabled ? styles.disabled : ""].join(
    " "
  );

  return (
    <button
      className={[styles.container, sizeClass].join(" ")}
      onClick={disabled ? () => {} : onClick}
    >
      <div className={contentClass}>{children}</div>
    </button>
  );
}
