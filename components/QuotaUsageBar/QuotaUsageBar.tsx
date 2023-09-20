import React from "react";

import styles from "./QuotaUsageBar.module.css";

type Props = {
  quotaUsed: number;
  quotaTotal: number;
};

export default function QuotaUsageBar({ quotaUsed, quotaTotal }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles["text"]}>
        <span className={styles.title}>Storage </span>
        {Math.round(quotaUsed)} KB used out of {Math.round(quotaTotal)} KB
        available
      </div>
      <div className={styles["bar-background"]}>
        <div
          className={styles["bar"]}
          style={{ width: `${(quotaUsed / quotaTotal) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
