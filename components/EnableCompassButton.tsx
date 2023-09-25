import React from "react";

import Button from "@/components/Button/Button";
import { CompassIcon } from "./Icons/Icons";

type Props = {
  onClick: () => void;
};

export const EnableCompassButton = ({ onClick }: Props) => (
  <Button onClick={onClick}>
    <CompassIcon />
  </Button>
);
