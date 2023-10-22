import React from "react";
import Button from "../Button";
import { CompassIcon } from "@/components/Icons/Icons";

type Props = {
  zoomToUser?: () => void;
  className: string;
};

export default function ZoomToUserButton({ zoomToUser, className }: Props) {
  const onClick = zoomToUser
    ? zoomToUser
    : () => console.error("Provide `zoomToUser` to ZoomToUserButton");
  return (
    <div className={className}>
      <Button onClick={onClick} type="opaque" size="medium" isElevated>
        <CompassIcon />
      </Button>
    </div>
  );
}
