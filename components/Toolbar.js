import { useRouter } from "next/router";

import styles from "@/components/Toolbar.module.css";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";

export default function Toolbar() {
  const router = useRouter();

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

  const handleAddNewMap = () => {
    router.push("/add-map");
  };

  return (
    <>
      {(start || end) && (
        <div className={styles["reset-container"]}>
          <button onClick={handleMapReset}>Reset Pins</button>
        </div>
      )}
      <div className={styles["map-options-container"]}>
        <button onClick={changeToNextMap}>Next Map</button>
        <button onClick={handleAddNewMap}>Add New Map</button>
      </div>
    </>
  );
}
