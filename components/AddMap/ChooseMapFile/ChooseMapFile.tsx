import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  getMaximumStorageAmount,
  getUsedStorageAmount,
} from "@/utils/localStorage";

import ClearButton from "@/components/ClearButton/ClearButton";

import styles from "./ChooseMapFile.module.css";
import { QuestionIcon } from "@/components/Icons/Icons";

const QuotaUsageBar = dynamic(
  () => import("@/components/QuotaUsageBar/QuotaUsageBar"),
  {
    ssr: false,
  }
);

type Props = {
  hasSavedMaps: boolean;
  onCancelChooseMap: () => void;
  onMapFileSelected: (srcURL: string) => void;
};

export default function ChooseMapFile({
  hasSavedMaps,
  onCancelChooseMap,
  onMapFileSelected,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSelectMapFile = () => {
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
        onMapFileSelected(result);
      }
    };
    reader.readAsDataURL(file);
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
        <ClearButton onClick={handleSelectMapFile}>ADD MAP PHOTO</ClearButton>
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
      {!hasSavedMaps && (
        <ClearButton onClick={() => router.push("/how-to-use")}>
          <QuestionIcon />
          HOW TO USE TRAILHEAD
        </ClearButton>
      )}
      {hasSavedMaps && (
        <ClearButton onClick={onCancelChooseMap}>USE SAVED MAPS</ClearButton>
      )}
    </div>
  );
}
