import React from "react";

import { CancelIcon, ConfirmIcon } from "../../Icons/Icons";
import ClearButton from "../../ClearButton/ClearButton";
import { InterpolateMap } from "../../InterpolateMap";

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
        <ClearButton onClick={handleCancelSelection}>
          <CancelIcon />
          SELECT NEW IMAGE
        </ClearButton>
        <ClearButton onClick={handleConfirmMap}>
          <ConfirmIcon />
          CONFIRM
        </ClearButton>
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
