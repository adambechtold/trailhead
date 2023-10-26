import { Pin, Location } from "@/types/Vector";
import React from "react";

import styles from "./UserLocationSummary.module.css";

type Props = {
  userLocation: Location;
  onClick: () => void;
  accuracy?: number;
  userPin?: Pin;
};

export default function UserLocationSummary({
  userLocation,
  onClick,
  accuracy,
  userPin,
}: Props) {
  const location: Location = userPin ? userPin.location : userLocation;

  return (
    <div
      className={[styles["container"], "opaque", "elevated"].join(" ")}
      onClick={onClick}
    >
      <h4>User Pin</h4>

      <h5>Coordinates</h5>
      <p>Longitude: {location.coordinates.longitude}</p>
      <p>Latitude: {location.coordinates.latitude}</p>
      <p>Accuracy: {accuracy ? accuracy : "Unknown"}</p>

      <h5>Map Point</h5>
      <p>top: {userPin ? -1 * userPin.mapPoint.y : "TBD"}</p>
      <p>left: {userPin ? userPin.mapPoint.x : "TBD"}</p>
    </div>
  );
}
