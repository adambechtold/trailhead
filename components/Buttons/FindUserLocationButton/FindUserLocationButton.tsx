import React from "react";
import Button from "@/components/Buttons/Button";
import { ArrowIcon } from "@/components/Icons/Icons";

type Props = {
  startWatchingUserLocation: () => void;
  className?: string;
};

export default function FindUserLocationButton({
  startWatchingUserLocation,
  className,
}: Props) {
  return (
    <div className={className}>
      <Button
        onClick={startWatchingUserLocation}
        type="opaque"
        size="medium"
        isElevated
      >
        <ArrowIcon isFilled={false} /> Find Your Location
      </Button>
    </div>
  );
}
