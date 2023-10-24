import React from "react";

import { CancelIcon, ConfirmIcon } from "@/components/Icons/Icons";
import Button from "@/components/Buttons/Button";
import InterpolateMap from "@/components/InterpolateMap";

import styles from "./ConfirmMap.module.css";
import { Map } from "@/types/Map";
import { Location } from "@/types/Vector";

type Props = {
  previewMap: Map;
  userLocation?: Location;
  onConfirmSelection: () => void;
  onCancelSelection: () => void;
};

export default function ConfirmMap({
  previewMap,
  userLocation,
  onConfirmSelection,
  onCancelSelection,
}: Props) {
  const handleConfirmMap = () => onConfirmSelection();
  const handleCancelSelection = () => onCancelSelection();

  return (
    <>
      <div
        className={[
          styles["overlay-bottom"],
          styles["horizontal-container"],
        ].join(" ")}
      >
        <Button
          onClick={handleCancelSelection}
          type="opaque"
          size="medium"
          isElevated
        >
          <CancelIcon />
          Select New Image
        </Button>
        <Button
          onClick={handleConfirmMap}
          type="opaque"
          size="medium"
          isElevated
        >
          <ConfirmIcon />
          Confirm
        </Button>
      </div>
      <InterpolateMap
        mapURL={previewMap.url}
        start={previewMap.start}
        end={previewMap.end}
        userLocation={userLocation}
      />
    </>
  );
}
