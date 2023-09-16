// This could probably be a stateless component
import React from "react";
import { useRouter } from "next/router";

import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import ClearButton from "@/components/ClearButton/ClearButton";

import styles from "./DisplayMapData.module.css";

const displayObject = (object, name) => {
  return (
    <div className={styles["debug-item"]}>
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

export default function DisplayMapData() {
  const { userLocation } = useUserLocationContext();
  const { map } = useMapContext();
  const router = useRouter();
  const { start, end } = map;

  const flattenObject = (object) => {
    const flattenedObject = {};
    Object.keys(object).forEach((key) => {
      if (typeof object[key] === "object") {
        const flattenedChildObject = flattenObject(object[key]);
        Object.keys(flattenedChildObject).forEach((childKey) => {
          flattenedObject[`${key}.${childKey}`] =
            flattenedChildObject[childKey];
        });
      } else {
        flattenedObject[key] = object[key];
      }
    });
    return flattenedObject;
  };

  const returnToNavigate = () => {
    router.push("/navigate");
  };

  const content =
    !start && !end && !userLocation ? (
      <div>No data to display.</div>
    ) : (
      <>
        {start && displayObject(flattenObject(start), "Pin 1")}
        {end && displayObject(flattenObject(end), "Pin 2")}
        {userLocation &&
          displayObject(flattenObject(userLocation), "User Location")}
      </>
    );

  return (
    <div className={styles.container}>
      {content}
      <div className={styles["button-container"]}>
        <ClearButton onClick={returnToNavigate}>RETURN TO NAVIGATE</ClearButton>
      </div>
    </div>
  );
}
