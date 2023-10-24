import React, { useState } from "react";

import Button from "@/components/Buttons/Button";

import styles from "./SettingsPanel.module.css";
import { GearIcon, PlusIcon, MinusIcon } from "../Icons/Icons";
import { EnableCompassButton } from "../Buttons/EnableCompassButton/EnableCompassButton";

type Props = {
  pinScale: number;
  setPinScale: (newScale: number) => void;
  canResetPins: boolean;
  resetPins: () => void;
  showEnableCompass: boolean;
  startWatchingUserHeading: () => void;
};

export default function ControlPinScale({
  pinScale,
  setPinScale,
  canResetPins,
  resetPins,
  showEnableCompass,
  startWatchingUserHeading,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const pinScaleAdjustment = 0.8;
  const minPinScale = 1;
  const incrementPinScale = () => {
    const newPinScale = pinScale + pinScaleAdjustment;
    setPinScale(newPinScale);
  };

  const decrementPinScale = () => {
    let newPinScale = pinScale - pinScaleAdjustment;
    if (newPinScale < minPinScale) newPinScale = minPinScale;
    setPinScale(newPinScale);
  };

  return (
    <div className={styles.container}>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        type={isOpen ? "clear" : "opaque"}
        isElevated={!isOpen}
        size="medium"
      >
        <GearIcon />
      </Button>
      {isOpen && (
        <div className={styles["control-panel"]}>
          {showEnableCompass && (
            <EnableCompassButton onClick={startWatchingUserHeading} />
          )}
          {canResetPins && (
            <div
              className={[styles["background-container"], "elevated"].join(" ")}
            >
              <span className={styles.title}>Pin Size</span>
              <div className={styles["plus-minus-container"]}>
                <Button onClick={decrementPinScale} type="clear" size="small">
                  <MinusIcon size="small" />
                </Button>
                <Button onClick={incrementPinScale} type="clear" size="small">
                  <PlusIcon size="small" />
                </Button>
              </div>
            </div>
          )}
          {canResetPins && (
            <Button onClick={resetPins} type="opaque" size="small" isElevated>
              Reset Pins
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
