import React, { useState } from "react";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import AccuracyIndicator from "./AccuracyIndicator/AccuracyIndicator";
import UserLocationSummary from "./UserLocationSummary/UserLocationSummary";

import { Map } from "@/types/Map";
import { getUserPin } from "@/utils/vector";

import styles from "./UserLocationPanel.module.css";

type Props = {
  map: Map;
};

export default function UserLocationPanel({ map }: Props) {
  const [showUserSummary, setShowUserSummary] = useState(false);
  const {
    currentAcceptedUserLocation: userLocation,
    isWatchingLocation,
    error: userLocationError,
    mostRecentLocation,
  } = useUserLocationContext();

  const canDisplayAccuracyIndicator =
    userLocation || isWatchingLocation || userLocationError;
  let accuracyToDisplay = userLocation?.accuracy;
  if (isWatchingLocation) {
    if (mostRecentLocation) {
      accuracyToDisplay = mostRecentLocation.accuracy;
    } else {
      accuracyToDisplay = undefined;
    }
  }

  const toggleShowUserSummary = () => {
    setShowUserSummary((prev) => !prev);
  };

  let userPin = undefined;
  if (map && map.pins && map.pins.length >= 2 && userLocation) {
    userPin = getUserPin(map.pins, userLocation);
  }

  return (
    <div className={styles.container}>
      {!showUserSummary && canDisplayAccuracyIndicator && (
        <div onClick={toggleShowUserSummary}>
          <AccuracyIndicator
            accuracy={accuracyToDisplay}
            isUpdating={isWatchingLocation}
            error={!!userLocationError}
          />
        </div>
      )}
      {showUserSummary && userLocation && (
        <UserLocationSummary
          userPin={userPin}
          userLocation={userLocation}
          accuracy={accuracyToDisplay}
          onClick={toggleShowUserSummary}
        />
      )}
    </div>
  );
}
