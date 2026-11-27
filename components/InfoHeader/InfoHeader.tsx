import React from "react";
import { useRouter } from "next/router";

import Logo from "../Logo/Logo";
import styles from "./InfoHeader.module.css";

type Props = {
  audience: "hikers" | "trail-managers";
};

export default function InfoHeader({ audience }: Props) {
  const router = useRouter();
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

  const setAudience = (audience: "hikers" | "trail-managers") => {
    router.push("/info/" + audience);
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
