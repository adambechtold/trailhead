import React from "react";

import styles from "./Button.module.css";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  size?: "small" | "medium";
  disabled?: boolean;
  type?: "clear" | "opaque" | "default";
};

export default function Button({
  onClick,
  children,
  size = "medium",
  disabled = false,
  type = "clear",
}: Props) {
  const sizeClass = styles[`size-${size}`];
  const contentClass = [styles.content, disabled ? styles.disabled : ""].join(
    " "
  );
  const typeClass = styles[`type-${type}`];

  return (
    <button
      className={[styles.container, sizeClass, typeClass].join(" ")}
      onClick={disabled ? () => {} : onClick}
    >
      <div className={contentClass}>{children}</div>
    </button>
  );
}
