import styles from "@/components/Toolbar.module.css";

import { useMapContext } from "@/contexts/MapContext";

export default function Toolbar({ pins, resetCurrentMap }) {
  const { nextMap } = useMapContext();

  // Next Map
  const changeToNextMap = () => {
    nextMap();
    resetCurrentMap();
  };

  return (
    <div className={styles.toolbarContainer}>
      {pins.length > 0 ? (
        <button onClick={resetCurrentMap}>Reset Pins</button>
      ) : (
        <div></div>
      )}
      <button onClick={changeToNextMap}>Next Map</button>
    </div>
  );
}
