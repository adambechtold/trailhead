// This could probably be a stateless component
import React from "react";
import { useRouter } from "next/router";

import { Map } from "@/types/Map";
import { Location } from "@/types/Vector";

import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import ClearButton from "@/components/ClearButton/ClearButton";

import styles from "./DisplayMapData.module.css";
import { TrashIcon } from "../Icons/Icons";

export default function DisplayMapData() {
  const {
    currentAcceptedUserLocation,
    currentHeading,
    isWatchingHeading,
    startWatchingHeading,
    mostRecentLocation,
    isWatchingLocation,
    error,
    startWatchingUserLocation,
  } = useUserLocationContext();
  const { map, deleteStartPin, deleteEndPin } = useMapContext();
  const router = useRouter();

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
      {map && (
        <MapData
          map={map}
          deleteStartPin={deleteStartPin}
          deleteEndPin={deleteEndPin}
        />
      )}
      <UserLocationData
        currentAcceptedUserLocation={currentAcceptedUserLocation}
        currentHeading={currentHeading}
        isWatchingHeading={isWatchingHeading}
        mostRecentLocation={mostRecentLocation}
        isWatchingLocation={isWatchingLocation}
        error={error}
      />
      <div className={styles["button-container"]}>
        <ClearButton onClick={returnToNavigate}>RETURN TO NAVIGATE</ClearButton>
        <ClearButton onClick={clearLocalStorage}>
          CLEAR LOCAL STORAGE
        </ClearButton>
        <ClearButton
          onClick={startWatchingUserLocation}
          disabled={isWatchingLocation}
        >
          START WATCHING LOCATION
        </ClearButton>
        {isWatchingLocation && (
          <ClearButton
            onClick={startWatchingHeading}
            disabled={isWatchingHeading}
          >
            START WATCHING HEADING
          </ClearButton>
        )}
      </div>
    </div>
  );
}

type MapDataProps = {
  map: Map;
  deleteStartPin: (map: Map) => void;
  deleteEndPin: (map: Map) => void;
};

function MapData({ map, deleteStartPin, deleteEndPin }: MapDataProps) {
  return (
    <div>
      <h3>Map</h3>
      {map.start ? (
        <div className={styles.pin}>
          <p>{displayObject(flattenObject(map.start), "Start Pin")}</p>
          <div className={styles["delete-button"]}>
            <ClearButton onClick={() => deleteStartPin(map)} size="small">
              <TrashIcon />
            </ClearButton>
          </div>
        </div>
      ) : (
        <p>Start Position Not Set</p>
      )}
      {map.end ? (
        <div className={styles.pin}>
          <p>{displayObject(flattenObject(map.end), "End Pin")}</p>
          <div className={styles["delete-button"]}>
            <ClearButton onClick={() => deleteEndPin(map)} size="small">
              <TrashIcon />
            </ClearButton>
          </div>
        </div>
      ) : (
        <p>End Position Not Set</p>
      )}
    </div>
  );
}

type UserLocationData = {
  currentAcceptedUserLocation: Location | null;
  currentHeading: number | string | null;
  isWatchingHeading: boolean;
  mostRecentLocation: Location | null;
  isWatchingLocation: boolean;
  error: string | null;
};

function UserLocationData({
  currentAcceptedUserLocation,
  currentHeading,
  isWatchingHeading,
  mostRecentLocation,
  isWatchingLocation,
  error,
}: UserLocationData) {
  return (
    <div className={styles.section}>
      <h3>User Location</h3>
      <div className={styles.object}>
        {isWatchingHeading
          ? `🔄 User Heading: ${currentHeading}`
          : "❌ Not Tracking User Heading"}
      </div>
      <div className={styles.object}>
        {isWatchingLocation
          ? "🔄 Recieving User Location"
          : "❌ Not Tracking User Location"}
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
