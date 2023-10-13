import React from "react";

import styles from "./InfoHeader.module.css";
import Logo from "../Logo/Logo";

type Props = {
  audience: "hikers" | "trail-managers";
  setAudience: (audience: "hikers" | "trail-managers") => void;
};

export default function InfoHeader({ audience, setAudience }: Props) {
  const classes = {
    hikers: [
      styles["navigation-item"],
      audience === "hikers" ? styles["selected"] : "",
    ],
    trailManagers: [
      styles["navigation-item"],
      audience === "trail-managers" ? styles["selected"] : "",
    ],
  };

  return (
    <div className={styles["container"]}>
      <Logo />
      <div className={styles["navigation-container"]}>
        <span
          className={classes.hikers.join(" ")}
          onClick={() => setAudience("hikers")}
        >
          Hikers
        </span>
        <span
          className={classes.trailManagers.join(" ")}
          onClick={() => setAudience("trail-managers")}
        >
          Trail Managers
        </span>
      </div>
    </div>
  );
}
