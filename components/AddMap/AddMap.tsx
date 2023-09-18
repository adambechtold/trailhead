import React, { useState } from "react";
import { useMapContext } from "@/contexts/MapContext";
import { useRouter } from "next/router";
import {
  getMaximumStorageAmount,
  getUsedStorageAmount,
} from "@/utils/localStorage";

import ChooseMapFile from "@/components/AddMap/ChooseMapFile/ChooseMapFile";
import ConfirmMap from "@/components/AddMap/ConfirmMap/ConfirmMap";
import RejectMapFile from "@/components/AddMap/RejectMapFile/RejectMapFile";

export default function AddMap() {
  const { addMap, mapList, mapSaveError, removeMapError } = useMapContext();
  const router = useRouter();

  const [previewSrc, setPreviewSrc] = useState<string>("");

  const hasSavedMaps = mapList.length > 0;

  const handleConfirmSelection = () => {
    addMap(previewSrc);
    startNavigating();
  };

  const startNavigating = () => {
    router.push("/navigate");
  };

  const handleCancelSelection = () => {
    setPreviewSrc("");
  };

  const handleMapFileSelected = (srcURL: string) => {
    setPreviewSrc(srcURL);
  };

  const handleRemoveMap = () => {
    setPreviewSrc("");
    removeMapError();
  };

  if (previewSrc) {
    if (mapSaveError) {
      return (
        <RejectMapFile
          previewSrc={previewSrc}
          onConfirmRejection={handleRemoveMap}
        />
      );
    }
    if (canSavePhoto(previewSrc)) {
      return (
        <ConfirmMap
          previewSrc={previewSrc}
          onConfirmSelection={handleConfirmSelection}
          onCancelSelection={handleCancelSelection}
        />
      );
    } else {
      return (
        <RejectMapFile
          previewSrc={previewSrc}
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

function canSavePhoto(photoURL: string) {
  const quotaUsed = getUsedStorageAmount();
  const quotaTotal = getMaximumStorageAmount();
  const remainingQuota = quotaTotal - quotaUsed;
  const estimatedPhotoSize = photoURL.length / 1024;

  return estimatedPhotoSize < remainingQuota;
}
