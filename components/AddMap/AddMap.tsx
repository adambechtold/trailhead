import React, { useState } from "react";
import {
  getMaximumStorageAmount,
  getUsedStorageAmount,
} from "@/utils/localStorage";
import { useMapContext } from "@/contexts/MapContext";
import { useRouter } from "next/router";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import { Map, createMapFromUrl, isMap } from "@/types/Map";

import ChooseMapFile from "@/components/AddMap/ChooseMapFile/ChooseMapFile";
import ConfirmMap from "@/components/AddMap/ConfirmMap/ConfirmMap";
import RejectMapFile from "@/components/AddMap/RejectMapFile/RejectMapFile";

export default function AddMap() {
  const { addMap, mapList, mapSaveError, removeMapError } = useMapContext();
  const { currentAcceptedUserLocation } = useUserLocationContext();
  const router = useRouter();

  const [previewMap, setPreviewMap] = useState<Map | null>(null);

  const hasSavedMaps = mapList.length > 0;

  const handleConfirmSelection = () => {
    if (previewMap) {
      const result = addMap(previewMap);
      if (result) {
        startNavigating();
      } else {
        setPreviewMap(null);
      }
    }
  };

  const startNavigating = () => {
    router.push("/navigate");
  };

  const handleCancelSelection = () => {
    setPreviewMap(null);
  };

  const handleMapFileSelected = (file: File) => {
    const reader = new FileReader();

    reader.onload = function (event: ProgressEvent<FileReader>) {
      const result = event.target?.result;
      if (!result || typeof result !== "string") return;
      if (file.type === "application/json") {
        const parsedJSON = JSON.parse(result);
        if (!isMap(parsedJSON)) {
          console.error("parsed json is not a map", parsedJSON);
        }
        setPreviewMap(parsedJSON);
      } else if (file.type.startsWith("image/")) {
        const map = createMapFromUrl(result);
        setPreviewMap(map);
      }
    };

    if (file.type === "application/json") {
      reader.readAsText(file);
    } else if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    }
    //setPreviewMap(srcURL);
  };

  const handleRemoveMap = () => {
    setPreviewMap(null);
    removeMapError();
  };

  if (previewMap) {
    if (mapSaveError) {
      return (
        <RejectMapFile
          previewSrc={previewMap.url}
          onConfirmRejection={handleRemoveMap}
        />
      );
    }
    if (canSavePhoto(previewMap.url)) {
      return (
        <ConfirmMap
          previewMap={previewMap}
          onConfirmSelection={handleConfirmSelection}
          onCancelSelection={handleCancelSelection}
          userLocation={currentAcceptedUserLocation || undefined}
        />
      );
    } else {
      return (
        <RejectMapFile
          previewSrc={previewMap.url}
          onConfirmRejection={handleCancelSelection}
        />
      );
    }
  }

  return (
    <ChooseMapFile
      hasSavedMaps={hasSavedMaps}
      onMapFileSelected={handleMapFileSelected}
      onCancelChooseMap={startNavigating}
    />
  );
}

// The storage quota check is switched off for now.
const CHECK_STORAGE_QUOTA = false;

function canSavePhoto(photoURL: string) {
  if (!CHECK_STORAGE_QUOTA) return true;
  const quotaUsed = getUsedStorageAmount();
  const quotaTotal = getMaximumStorageAmount();
  const remainingQuota = quotaTotal - quotaUsed;
  const estimatedPhotoSize = photoURL.length / 1024;

  return estimatedPhotoSize < remainingQuota;
}
