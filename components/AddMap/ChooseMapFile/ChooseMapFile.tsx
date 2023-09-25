import React from "react";
import dynamic from "next/dynamic";
import {
  getMaximumStorageAmount,
  getUsedStorageAmount,
} from "@/utils/localStorage";

import Button from "@/components/Button/Button";
import PictureGuidlines from "@/components/HowTo/PictureGuidelines";

import styles from "./ChooseMapFile.module.css";

const QuotaUsageBar = dynamic(
  () => import("@/components/QuotaUsageBar/QuotaUsageBar"),
  {
    ssr: false,
  }
);

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

  const quotaUsed = getUsedStorageAmount();
  const quotaTotal = getMaximumStorageAmount();

  return (
    <div
      className={[
        styles["input-container"],
        styles["overlay-centered"],
        styles["vertical-container"],
      ].join(" ")}
    >
      <div className={styles["add-map-container"]}>
        <Button onClick={handleSelectMapFile}>ADD MAP PHOTO</Button>
        <input
          className={styles["map-input"]}
          type="file"
          accept="image/*,.json"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          id="map-input"
        />
        {typeof window !== "undefined" && (
          <QuotaUsageBar quotaUsed={quotaUsed} quotaTotal={quotaTotal} />
        )}
        <div>
          <h4>For great maps, make sure that...</h4>
          <div style={{ paddingLeft: "1.1rem", paddingTop: "0.3rem" }}>
            <PictureGuidlines />
          </div>
        </div>
      </div>
      {hasSavedMaps && (
        <Button onClick={onCancelChooseMap}>USE SAVED MAPS</Button>
      )}
    </div>
  );
}
