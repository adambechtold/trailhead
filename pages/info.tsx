import React from "react";
import { useRouter } from "next/router";

import styles from "./info.module.css";
import Button from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

export default function Info() {
  const router = useRouter();

  return (
    <div className={[styles.container, montserrat.className].join(" ")}>
      <div className={styles.content}>
        <div className={styles["position-logo"]}>
          <Logo />
        </div>
        <div className={styles["content-section"]}>
          <h1 className={"gradient-text"}>Navigate Anywhere.</h1>
          <span className={styles.subtitle}>
            Turn any picture into a GPS-enabled map.
          </span>
        </div>
        <Button
          type="gradient-primary"
          size="medium"
          onClick={() => router.push("navigate")}
        >
          Start Navigating
        </Button>
        <div className={styles["content-section"]}>
          <h2>No Service? No Problem.</h2>
          <p>
            Trailhead is completely offline. No need to download anything before
            you hit the trail.
          </p>
          <p>Take a picture of the trail map and off you go.</p>
        </div>
        <div className={styles["content-section"]}>
          <h2>Discover Everything.</h2>
          <p>
            Local maps contain far more information than generic trail apps.
          </p>
          <p>
            Find scenic lookouts, trail colors, and property boundaries that
            AllTrails and Gaia leave behind.
          </p>
        </div>
        <div className={styles["content-section"]}>
          <h2>More to Come.</h2>
          <p>New features delivered every week.</p>
          <h3>Up Next:</h3>
          <p>🧭 Multiple Pins Increase Accuracy</p>
          <p>📍 Zoom to User </p>
          <p>🐛 Some Users Are Not Prompted for Location Access</p>
        </div>
        <Button
          type="gradient-secondary"
          size="medium"
          onClick={() => {
            window.location.href = "mailto:feedback@adambechtold.xyz";
          }}
        >
          Request Feature
        </Button>
        <div className={styles.signature}>
          From <a href="https://www.adambechtold.xyz">Adam Bechtold</a>
        </div>
      </div>
    </div>
  );
}
