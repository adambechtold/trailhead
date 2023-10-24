import React, { useState } from "react";
import QRCode from "react-qr-code";
import Button from "@/components/Buttons/Button";

import styles from "./index.module.css";

export default function PresetMapsPage() {
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const demos = ["braemore", "timberlands"];

  const moveToNextMap = () => {
    setCurrentMapIndex((prev) => {
      const nextIndex = (prev + 1) % demos.length;
      return nextIndex;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <QRCodeLink mapName={demos[currentMapIndex]} />
        <Button onClick={moveToNextMap} size="medium" type="gradient-primary">
          Next Map
        </Button>
      </div>
    </div>
  );
}

function QRCodeLink({ mapName }: { mapName: string }) {
  const origin = window.origin;
  const presetRoot = `${origin}/demo/preset-maps`;
  const createLinkToMap = (mapName: string) => `${presetRoot}/${mapName}`;
  return (
    <div className={styles["qr-container"]}>
      <QRCode value={createLinkToMap(mapName)} />
      <a href={createLinkToMap(mapName)}>
        <h2 style={{ textTransform: "capitalize" }}>{mapName}</h2>
      </a>
    </div>
  );
}
