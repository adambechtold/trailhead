import React from "react";

import Button from "@/components/Button/Button";
import { CompassIcon } from "./Icons/Icons";

type Props = {
  onClick: () => void;
};

export const EnableCompassButton = ({ onClick }: Props) => (
<<<<<<< HEAD
  <Button onClick={onClick}>
=======
  <Button onClick={onClick} type="opaque">
>>>>>>> feature/show-current-heading
    <CompassIcon />
  </Button>
);
