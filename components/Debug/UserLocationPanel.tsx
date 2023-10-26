import React, { useState } from "react";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import AccuracyIndicator from "./AccuracyIndicator/AccuracyIndicator";
import UserLocationSummary from "./UserLocationSummary/UserLocationSummary";

import { Map } from "@/types/Map";
import { getUserPin } from "@/utils/vector";

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
  if (map.start && map.end && userLocation) {
    userPin = getUserPin(map.start, map.end, userLocation);
  }

  return (
    <>
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
    </>
  );
}
