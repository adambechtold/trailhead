import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { InterpolateMap } from "./InterpolateMap";
import ClearButton from "./ClearButton/ClearButton";
import { CancelIcon, ConfirmIcon } from "./Icons/Icons";

import { useMapContext } from "@/contexts/MapContext";

import styles from "./AddMap.module.css";

const QuotaUsageBar = dynamic(() => import("./QuotaUsageBar/QuotaUsageBar"), {
  ssr: false,
});

export default function AddMap() {
  const { addMap, mapList } = useMapContext();
  const router = useRouter();
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [isMapSelected, setIsMapSelected] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddMap = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event: ProgressEvent<FileReader>) {
      const result = event.target?.result?.toString();
      if (result) {
        setPreviewSrc(result);
        setIsMapSelected(true);
      }
    };
    reader.readAsDataURL(file);
  }

  const startNavigating = () => {
    router.push("/navigate");
  };
  const handleUseSavedMaps = () => {
    startNavigating();
  };

  type PreviewMapProps = {
    mapURL: string;
  };

  function PreviewMap({ mapURL }: PreviewMapProps) {
    return <InterpolateMap mapURL={mapURL} />;
  }

  function SelectMap() {
    let quotaUsed = 0;
    let quotaTotal = 5000; // 5MB
    if (typeof window !== "undefined" && window.localStorage) {
      quotaUsed = JSON.stringify(localStorage).length / 1024; // KB
    }

    return (
      <>
        <div className={styles["add-map-container"]}>
          <ClearButton onClick={handleAddMap}>ADD MAP PHOTO</ClearButton>
          <input
            className={styles["map-input"]}
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            id="map-input"
          />
          {typeof window !== "undefined" && (
            <QuotaUsageBar quotaUsed={quotaUsed} quotaTotal={quotaTotal} />
          )}
        </div>
        {!!mapList.length && (
          <ClearButton onClick={handleUseSavedMaps}>USE SAVED MAPS</ClearButton>
        )}
      </>
    );
  }

  const handleConfirmMap = () => {
    addMap(previewSrc);
    startNavigating();
  };

  const handleCancelSelection = () => {
    setPreviewSrc("");
    setIsMapSelected(false);
  };

  function ConfirmMap() {
    return (
      <>
        <ClearButton onClick={handleCancelSelection}>
          <CancelIcon />
          SELECT NEW IMAGE
        </ClearButton>
        <ClearButton onClick={handleConfirmMap}>
          <ConfirmIcon />
          CONFIRM
        </ClearButton>
      </>
    );
  }

  const positionClass = isMapSelected
    ? styles["overlay-bottom"]
    : styles["overlay-centered"];

  const orientationClass = isMapSelected
    ? styles["horizontal-container"]
    : styles["vertical-container"];

  return (
    <>
      <div
        className={[
          styles["input-container"],
          positionClass,
          orientationClass,
        ].join(" ")}
      >
        {!isMapSelected && <SelectMap />}
        {isMapSelected && <ConfirmMap />}
      </div>

      {previewSrc && <PreviewMap mapURL={previewSrc} />}
    </>
  );
}
