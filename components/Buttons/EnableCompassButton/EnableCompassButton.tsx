import React from "react";

import Button from "@/components/Buttons/Button";
import { CompassIcon } from "../../Icons/Icons";

type Props = {
  onClick: () => void;
};

export const EnableCompassButton = ({ onClick }: Props) => (
  <Button onClick={onClick} type="opaque" size="medium">
    <CompassIcon />
    ENABLE COMPASS
  </Button>
);
