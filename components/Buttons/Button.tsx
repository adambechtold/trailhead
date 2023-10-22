import React from "react";

import styles from "./Button.module.css";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  size: "small" | "medium";
  disabled?: boolean;
  type:
    | "clear"
    | "opaque"
    | "gradient-primary"
    | "gradient-secondary"
    | "default";
  isElevated?: boolean;
};

export default function Button({
  onClick,
  children,
  size,
  disabled = false,
  type,
  isElevated = false,
}: Props) {
  const sizeClass = styles[`size-${size}`];
  const contentClass = [styles.content, disabled ? styles.disabled : ""].join(
    " "
  );
  const typeClass =
    type === "gradient-secondary" ? `gradient-text ${type}` : type;
  const elevatedClass = isElevated ? "elevated" : "";

  const applyOutline = (child: React.ReactNode) => (
    <div className={styles["gradient-border-container"]}>{child}</div>
  );

  let result = (
    <button
      className={[
        styles.container,
        sizeClass,
        typeClass,
        elevatedClass,
        styles["no-border"],
      ].join(" ")}
      onClick={disabled ? () => {} : onClick}
    >
      <div className={contentClass}>{children}</div>
    </button>
  );

  if (type === "gradient-secondary") {
    result = applyOutline(result);
  }

  return result;
}
