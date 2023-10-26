import React, { useState } from "react";
import QRCode from "react-qr-code";
import Button from "@/components/Buttons/Button";

import styles from "./index.module.css";

type Demo = {
  path: string;
  name: string;
};

const demos: Demo[] = [
  { name: "braemore", path: "braemore" },
  { name: "timberlands", path: "timberlands" },
  { name: "bartlett", path: "bartlett-closeup" },
];

export default function PresetMapsPage() {
  const [currentMapIndex, setCurrentMapIndex] = useState(0);

  const moveToNextMap = () => {
    setCurrentMapIndex((prev) => {
      const nextIndex = (prev + 1) % demos.length;
      return nextIndex;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <DemoLink
          name={demos[currentMapIndex].name}
          path={demos[currentMapIndex].path}
        />
        <Button onClick={moveToNextMap} size="medium" type="gradient-primary">
          Next Map
        </Button>
      </div>
    </div>
  );
}

function DemoLink({ name, path }: Demo) {
  const origin = window.origin;
  const presetRoot = `${origin}/demo/preset-maps`;
  const createLinkToMap = (path: string) => `${presetRoot}/${path}`;
  return (
    <div className={styles["qr-container"]}>
      <QRCode value={createLinkToMap(path)} />
      <a href={createLinkToMap(path)}>
        <h2 style={{ textTransform: "capitalize" }}>{name}</h2>
      </a>
    </div>
  );
}
