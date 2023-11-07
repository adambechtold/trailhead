// This could probably be a stateless component
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Map } from "@/types/Map";
import { Location } from "@/types/Vector";

import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import Button from "@/components/Buttons/Button";

import styles from "./DisplayMapData.module.css";
import { TrashIcon } from "../../Icons/Icons";
import { HeadingError } from "@/contexts/userHeadingReducer";

export default function DisplayMapData() {
  const {
    currentAcceptedUserLocation,
    currentHeading,
    canWatchUserHeading,
    isWatchingHeading,
    headingError,
    startWatchingHeading,
    mostRecentLocation,
    isWatchingLocation,
    error,
    startWatchingUserLocation,
  } = useUserLocationContext();
  const { map, deletePinFromMap } = useMapContext();
  const router = useRouter();
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/manifest.webmanifest?v=${Date.now()}")
      .then((response) => response.json())
      .then((data) => {
        if (data.version) {
          setVersion(data.version);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const returnToNavigate = () => {
    router.push("/navigate");
  };

  const clearLocalStorage = () => {
    const result = confirm("Are you sure you want to clear local storage?");
    if (result) {
      // User clicked OK
      // Perform delete operation
      localStorage.clear();
      window.location.reload();
    } else {
      return;
    }
  };

  return (
    <div className={styles.container}>
      {map && <MapData map={map} deletePinFromMap={deletePinFromMap} />}
      <UserLocationData
        currentAcceptedUserLocation={currentAcceptedUserLocation}
        currentHeading={currentHeading}
        canWatchUserHeading={canWatchUserHeading}
        isWatchingHeading={isWatchingHeading}
        headingError={headingError}
        mostRecentLocation={mostRecentLocation}
        isWatchingLocation={isWatchingLocation}
        error={error}
      />
      <div className={styles["button-container"]}>
        <Button onClick={returnToNavigate} type="clear" size="medium">
          Return To Navigate
        </Button>
        <Button onClick={clearLocalStorage} type="clear" size="medium">
          Clear Local Storage
        </Button>
        <Button
          onClick={startWatchingUserLocation}
          disabled={isWatchingLocation}
          type="clear"
          size="medium"
        >
          Start Watching Location
        </Button>
        {isWatchingLocation && canWatchUserHeading && (
          <Button
            onClick={startWatchingHeading}
            disabled={isWatchingHeading}
            type="clear"
            size="medium"
          >
            Start Watching Heading
          </Button>
        )}
        {version && `Version: ${version}`}
        <a href="./">About Trailhead</a>
      </div>
    </div>
  );
}

type MapDataProps = {
  map: Map;
  deletePinFromMap: (map: Map, index: number) => void;
};

function MapData({ map, deletePinFromMap }: MapDataProps) {
  const onDeletePin = (index: number) => {
    const result = confirm(
      `Are you sure you want to delete pin #${index + 1}?`
    );
    if (result) {
      // User clicked OK
      // Perform delete operation
      deletePinFromMap(map, index);
    }
  };

  return (
    <div className={styles.section}>
      <h3>Map</h3>
      {map.pins && map.pins.length > 0 ? (
        map.pins.map((pin, index) => (
          <div className={styles.pin} key={`display-pin-${index + 1}`}>
            <p>{displayObject(flattenObject(pin), `Pin ${index + 1}`)}</p>
            <div className={styles["delete-button"]}>
              <Button
                onClick={() => onDeletePin(index)}
                size="small"
                type="clear"
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div>No Pins</div>
      )}
    </div>
  );
}

type UserLocationData = {
  currentAcceptedUserLocation: Location | null;
  currentHeading: number | string | null;
  canWatchUserHeading: boolean;
  isWatchingHeading: boolean;
  headingError: HeadingError | null;
  mostRecentLocation: Location | null;
  isWatchingLocation: boolean;
  error: string | null;
};

function UserLocationData({
  currentAcceptedUserLocation,
  currentHeading,
  canWatchUserHeading,
  isWatchingHeading,
  headingError,
  mostRecentLocation,
  isWatchingLocation,
  error,
}: UserLocationData) {
  return (
    <div className={styles.section}>
      <h3>User Location</h3>
      <div className={styles.object}>
        {isWatchingLocation
          ? "🔄 Recieving User Location"
          : "❌ Not Tracking User Location"}
      </div>
      <div className={styles.object}>
        {isWatchingHeading
          ? `🔄 User Heading: ${currentHeading}`
          : `❌ Not Tracking User Heading. ${
              canWatchUserHeading
                ? "This device supports user heading"
                : "Heading is not supported on this device."
            }`}
      </div>
      {currentAcceptedUserLocation &&
        displayObject(
          flattenObject(currentAcceptedUserLocation),
          "Current Accepted User Location"
        )}
      {mostRecentLocation &&
        displayObject(
          flattenObject(mostRecentLocation),
          "Most Recent Location"
        )}
      {error && <div>Error: {error}</div>}
      {headingError && <div>Heading Error: {headingError}</div>}
    </div>
  );
}

const flattenObject = (object: Record<string, any>): Record<string, any> => {
  const flattenedObject: Record<string, unknown> = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "object") {
      const flattenedChildObject = flattenObject(
        object[key] as Record<string, unknown>
      );
      Object.keys(flattenedChildObject).forEach((childKey) => {
        flattenedObject[`${key}.${childKey}`] = flattenedChildObject[childKey];
      });
    } else {
      flattenedObject[key] = object[key];
    }
  });
  return flattenedObject;
};

const displayObject = (object: Record<string, string>, name: string) => {
  return (
    <div className={styles.object}>
      <h4>{name}</h4>
      {Object.keys(object).map((key) => {
        return (
          <div key={`${name}-${key}`}>
            {key}: {object[key]}
          </div>
        );
      })}
    </div>
  );
};
