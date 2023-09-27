import React from "react";

import styles from "./Icons.module.css";

type Size = "small" | "medium";
const DEFAULT_SIZE: Size = "medium";

type BaseIconProps = {
  size?: Size;
  src: string;
  inText?: boolean;
};

type TypedIconProps = {
  size?: Size;
};

function Icon({ size = DEFAULT_SIZE, inText = false, src }: BaseIconProps) {
  const iconClasses = [styles[`size-${size}`]];
  if (inText) {
    iconClasses.push(styles["pad-bottom-a-tiny-bit"]);
  }

  return <img className={iconClasses.join(" ")} src={src} />;
}

export function CancelIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/cancel-x.svg"} inText={true} />;
}

export function ConfirmIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/confirm-check.svg"} inText={true} />;
}

export function QuestionIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/question-mark.svg"} />;
}

export function TrashIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/trash-outline.svg"} />;
}

export function ShareIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/share-icon.svg"} />;
}

export function CompassIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/compass-no-ring.svg"} />;
}

export function GearIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/gear.svg"} />;
}
