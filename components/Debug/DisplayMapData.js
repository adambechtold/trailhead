// This could probably be a stateless component

import { useMapContext } from "@/contexts/MapContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import styles from "./DisplayMapData.module.css";

const displayObject = (object, name) => {
  return (
    <div className={styles.debugItem}>
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
  const { start, end } = useMapContext();

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

  return (
    <div className={styles.container}>
      {start && displayObject(flattenObject(start), "Pin 1")}
      {end && displayObject(flattenObject(end), "Pin 2")}
      {userLocation &&
        displayObject(flattenObject(userLocation), "User Location")}
    </div>
  );
}
