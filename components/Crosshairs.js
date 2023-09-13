// consider making this a stateless component
import { useCreatePinContext } from "@/contexts/CreatePinContext";

import styles from "@/components/Crosshairs.module.css";

export default function Crosshairs() {
  const { inProgress: isCreatingPin, selectPositionElementName } =
    useCreatePinContext();

  return (
    <>
      {isCreatingPin && (
        <div className={styles.container}>
          <div className={styles.centerPoint} id={selectPositionElementName} />
          <div className={styles.horizontalLine} />
          <div className={styles.verticalLine} />
        </div>
      )}
    </>
  );
}
