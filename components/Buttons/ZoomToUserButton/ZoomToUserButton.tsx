import React from "react";
import Button from "../Button";
import { CompassIcon } from "@/components/Icons/Icons";

type Props = {
  zoomToUser: () => void;
};

export default function ZoomToUserButton({ zoomToUser }: Props) {
  return (
    <Button onClick={zoomToUser} type="opaque" size="medium" isElevated>
      <CompassIcon />
    </Button>
  );
}
