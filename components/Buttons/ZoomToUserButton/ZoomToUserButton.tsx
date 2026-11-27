import { ArrowIcon } from "@/components/Icons/Icons";
import Button from "../Button";
import React from "react";

type Props = {
  zoomToUser?: () => void;
  className?: string;
  isEnabled: boolean;
};

export default function ZoomToUserButton({
  zoomToUser,
  className,
  isEnabled = false,
}: Props) {
  const onClick = zoomToUser
    ? zoomToUser
    : () => console.error("Provide `zoomToUser` to ZoomToUserButton");
  return (
    <div className={className}>
      <Button onClick={onClick} type="opaque" size="medium" isElevated>
        <ArrowIcon isFilled={isEnabled} />
      </Button>
    </div>
  );
}
