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
  return <Icon size={size} src={"icons/cancel-x.svg"} inText={true} />;
}

export function ConfirmIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/confirm-check.svg"} inText={true} />;
}

export function QuestionIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/question-mark.svg"} />;
}

export function TrashIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/trash-outline.svg"} />;
}

export function ShareIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/share-icon.svg"} />;
}

export function CompassIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/compass-no-ring.svg"} />;
}

export function GearIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/gear.svg"} />;
}

export function PlusIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/plus-icon.svg"} />;
}

export function MinusIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"icons/minus-icon.svg"} />;
}
