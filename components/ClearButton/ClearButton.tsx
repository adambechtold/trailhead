import React from "react";

import styles from "./ClearButton.module.css";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
};

export default function ClearButton({ onClick, children }: Props) {
  return (
    <button className={styles.container} onClick={onClick}>
      {children}
    </button>
  );
}
