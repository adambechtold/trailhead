import React from "react";

import logoSVG from "@/public/logo.svg";

import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logoSVG.src} />
      Trailhead
    </div>
  );
}
