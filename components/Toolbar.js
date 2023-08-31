import styles from "@/components/Toolbar.module.css";

export default function Toolbar({ changeToNextMap, pins, resetCurrentMap }) {
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
