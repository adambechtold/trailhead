import styles from "@/components/Toolbar.module.css";

import { useMapContext } from "@/contexts/MapContext";

export default function Toolbar({ resetCurrentMap }) {
  const { nextMap, start, end, resetPins } = useMapContext();

  // Next Map
  const changeToNextMap = () => {
    nextMap();
    resetCurrentMap();
  };

  const handleMapReset = () => {
    resetPins();
    resetCurrentMap();
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
