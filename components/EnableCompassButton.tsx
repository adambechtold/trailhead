import React from "react";

import ClearButton from "@/components/ClearButton/ClearButton";
import { CompassIcon } from "./Icons/Icons";

type Props = {
  onClick: () => void;
};

export const EnableCompassButton = ({ onClick }: Props) => (
  <ClearButton onClick={onClick}>
    <CompassIcon />
  </ClearButton>
);
