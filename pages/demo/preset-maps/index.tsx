import React from "react";
import QRCode from "react-qr-code";

import styles from "./index.module.css";

export default function PresetMapsPage() {
  const origin = window.origin;
  const presetRoot = `${origin}/demo/preset-maps`;
  const createLinkToMap = (mapName: string) => `${presetRoot}/${mapName}`;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles["qr-container"]}>
          <QRCode value={createLinkToMap("braemore")} />
          <a href={createLinkToMap("braemore")}>
            <h2>Braemore</h2>
          </a>
        </div>
      </div>
    </div>
  );
}
