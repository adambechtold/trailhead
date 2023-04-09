
import styles from '@/components/toolbar.module.css';

export default function Toolbar({
  changeToNextMap,
  pins,
  resetCurrentMap
}) {
  return (
    <div className={styles.toolbarContainer}>
        {pins.length > 0 && <button onClick={resetCurrentMap}>Reset Pins</button>}
        <button onClick={changeToNextMap}>Next Map</button>
    </div>
  )
}