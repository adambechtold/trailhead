import React from "react";

import { CancelIcon, ConfirmIcon } from "../../Icons/Icons";
import Button from "../../Button/Button";
import InterpolateMap from "../../InterpolateMap";

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
        <Button onClick={handleCancelSelection} type="opaque">
          <CancelIcon />
          SELECT NEW IMAGE
        </Button>
        <Button onClick={handleConfirmMap} type="opaque">
          <ConfirmIcon />
          CONFIRM
        </Button>
      </div>
      <InterpolateMap
        mapURL={previewMap.url}
        pins={previewMap.pins}
        userLocation={userLocation}
      />
    </>
  );
}
