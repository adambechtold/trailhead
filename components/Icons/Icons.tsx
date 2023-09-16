import React from "react";

import styles from "./Icons.module.css";

export function CancelIcon() {
  return <img className={styles["icon-img"]} src={"/cancel-x.svg"} />;
}

export function ConfirmIcon() {
  return <img className={styles["icon-img"]} src={"/confirm-check.svg"} />;
}
