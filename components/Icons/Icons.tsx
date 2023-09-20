import React from "react";

import styles from "./Icons.module.css";

type Size = "small" | "medium";
const DEFAULT_SIZE: Size = "medium";

type BaseIconProps = {
  size?: Size;
  src: string;
};

type TypedIconProps = {
  size?: Size;
};

function Icon({ size = DEFAULT_SIZE, src }: BaseIconProps) {
  return <img className={styles[`size-${size}`]} src={src} />;
}

export function CancelIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/cancel-x.svg"} />;
}

export function ConfirmIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/confirm-check.svg"} />;
}

export function QuestionIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/question-mark.svg"} />;
}

export function TrashIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/trash-outline.svg"} />;
}
