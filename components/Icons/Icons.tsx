import React from "react";

import styles from "./Icons.module.css";

type Size = "small" | "medium" | "large";
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

  return <img className={iconClasses.join(" ")} src={src} />;
}

export function CancelIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/cancel-x.svg"} inText={true} />;
}

export function ConfirmIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/confirm-check.svg"} inText={true} />;
}

export function CircleConfirmIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/green-check.svg"} />;
}

export function FailIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/fail-icon.svg"} />;
}

export function QuestionIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/question-mark.svg"} />;
}

export function TrashIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/trash-outline.svg"} />;
}

export function ShareIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/share-icon.svg"} />;
}

export function DownloadIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return (
    <div style={{ paddingRight: "1px", paddingLeft: "1px" }}>
      <Icon size={size} src={"/icons/download-icon.svg"} />
    </div>
  );
}

export function CompassIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/compass-no-ring.svg"} />;
}

export function GearIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/gear.svg"} />;
}

export function PlusIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/plus-icon.svg"} />;
}

export function MinusIcon({ size = DEFAULT_SIZE }: TypedIconProps) {
  return <Icon size={size} src={"/icons/minus-icon.svg"} />;
}

type ArrowProps = TypedIconProps & {
  isFilled: boolean;
};

export function ArrowIcon({
  size = DEFAULT_SIZE,
  isFilled = false,
}: ArrowProps) {
  const source = isFilled
    ? "/icons/arrow-filled.svg"
    : "/icons/arrow-hollow.svg";

  return (
    <div
      style={{
        transform: "rotate(45deg)",
        paddingRight: "2px",
        paddingLeft: "2px",
      }}
    >
      <Icon size={size} src={source} />
    </div>
  );
}
