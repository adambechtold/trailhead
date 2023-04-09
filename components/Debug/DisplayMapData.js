
import styles from "./DisplayMapData.module.css";

const displayObject = (object, name) => {
  console.log(object)
  return (
    <div className={styles.debugItem}>
      <h4>{name}</h4>
      {Object.keys(object).map((key) => {
        return (
          <div>
            {key}: {object[key]}
          </div>
        );
      })}
    </div>
  );
}

export default function DisplayMapData({
  pins,
  userLocation,
  mapFunctionParameters
}) {

  return (
    <div className={styles.container}>
      {pins[0] && displayObject(pins[0], "Pin 1")}
      {pins[1] && displayObject(pins[1], "Pin 2")}
      {mapFunctionParameters &&  displayObject(mapFunctionParameters, "Map Function")}
      {userLocation && displayObject(userLocation, "User Location")}
    </div>
  );
}