import styles from "@/components/Toolbar.module.css";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";

export default function Toolbar() {
  const { nextMap, start, end, resetPins } = useMapContext();
  const { endCreatePin } = useCreatePinContext();

  // Next Map
  const changeToNextMap = () => {
    nextMap();
    endCreatePin();
  };

  const handleMapReset = () => {
    resetPins();
    endCreatePin();
  };

  return (
    <div className={styles.toolbarContainer}>
      {start || end ? (
        <button onClick={handleMapReset}>Reset Pins</button>
      ) : (
        <div></div>
      )}
      <button onClick={changeToNextMap}>Next Map</button>
    </div>
  );
}
