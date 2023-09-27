import React from "react";

import styles from "./Button.module.css";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  size?: "small" | "medium";
  disabled?: boolean;
  type?: "clear" | "opaque" | "default";
  isElevated?: boolean;
};

export default function Button({
  onClick,
  children,
  size = "medium",
  disabled = false,
  type = "clear",
  isElevated = true,
}: Props) {
  const sizeClass = styles[`size-${size}`];
  const contentClass = [styles.content, disabled ? styles.disabled : ""].join(
    " "
  );
  const typeClass = type === "clear" ? "clear" : "opaque";
  const elevatedClass = isElevated ? "elevated" : "";

  return (
    <button
      className={[styles.container, sizeClass, typeClass, elevatedClass].join(
        " "
      )}
      onClick={disabled ? () => {} : onClick}
    >
      <div className={contentClass}>{children}</div>
    </button>
  );
}
