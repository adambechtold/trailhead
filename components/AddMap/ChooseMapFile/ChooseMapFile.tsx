import React from "react";

import Button from "@/components/Button/Button";
import PictureGuidelines from "@/components/HowTo/PictureGuidelines";

import styles from "./ChooseMapFile.module.css";

type Props = {
  hasSavedMaps: boolean;
  onCancelChooseMap: () => void;
  onMapFileSelected: (file: File) => void;
};

export default function ChooseMapFile({
  hasSavedMaps,
  onCancelChooseMap,
  onMapFileSelected,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectMapFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files?.[0];
    if (!file) return;
    onMapFileSelected(file);
  }

  return (
    <div
      className={[
        styles["input-container"],
        styles["overlay-centered"],
        styles["vertical-container"],
      ].join(" ")}
    >
      <div className={styles["add-map-container"]}>
        <Button onClick={handleSelectMapFile} size="medium" type="clear">
          ADD MAP PHOTO
        </Button>
        <input
          className={styles["map-input"]}
          type="file"
          accept="image/*,.json"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          id="map-input"
        />
        <div>
          <h4>For great maps, make sure...</h4>
          <div
            style={{
              paddingLeft: "1.1rem",
              paddingTop: "0.3rem",
            }}
          >
            <PictureGuidelines />
          </div>
        </div>
      </div>
      {hasSavedMaps && (
        <Button onClick={onCancelChooseMap} size={"medium"} type={"clear"}>
          USE SAVED MAPS
        </Button>
      )}
    </div>
  );
}
