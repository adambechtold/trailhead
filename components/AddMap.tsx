import React, { useState } from "react";
import { useRouter } from "next/router";
import { InterpolateMap } from "./InterpolateMap";
import MapControls from "./MapControls";
import { useMapContext } from "@/contexts/MapContext";

import styles from "./AddMap.module.css";

export default function AddMap() {
  const { addMap } = useMapContext();
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

  function AddMap() {
    return (
      <>
        <button onClick={handleAddMap} className={styles.button}>
          Add Map Photo
        </button>
        <input
          className={styles["map-input"]}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          id="map-input"
        />
        <button onClick={handleUseSavedMaps} className={styles.button}>
          Use Saved Maps
        </button>
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
        <button onClick={handleCancelSelection} className={styles.button}>
          Clear Selection
        </button>
        <button onClick={handleConfirmMap} className={styles.button}>
          Use This Map
        </button>
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
        {!isMapSelected && <AddMap />}
        {isMapSelected && <ConfirmMap />}
      </div>

      {previewSrc && <PreviewMap mapURL={previewSrc} />}
    </>
  );
}
