// consider making this a stateless component
import { useCreatePinContext } from "@/contexts/CreatePinContext";

import styles from "@/components/Crosshairs.module.css";

export default function Crosshairs() {
  const { inProgress: isCreatingPin, selectPositionElementName } =
    useCreatePinContext();

  type Quadrant = "upper-left" | "upper-right" | "lower-left" | "lower-right";
  const arcClass = (quadrant: Quadrant) =>
    [styles.arc, styles[quadrant]].join(" ");

  return (
    <>
      {isCreatingPin && (
        <div className={styles.container}>
          <div className={styles.centerPoint} id={selectPositionElementName} />
          <div className={styles.circle}>
            <div className={arcClass("upper-left")} />
            <div className={arcClass("lower-left")} />
            <div className={arcClass("lower-right")} />
            <div className={arcClass("upper-right")} />
          </div>
          <div className={styles.horizontalLine} />
          <div className={styles.verticalLine} />
        </div>
      )}
    </>
  );
}
