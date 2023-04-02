import styles from '@/components/menu-tray.module.css';

export default function MenuTray({ isSettingLocation, setIsSettingLocation, pins, setPins, crosshairsPosition, mapPosition }) {

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  }

  const addPin = () => {
    const { scale } = mapPosition;

    setPins([
      ...pins,
      {
        left: (crosshairsPosition.x - mapPosition.x) / scale,
        top: (crosshairsPosition.y - mapPosition.y) / scale,
        index: pins.length
      }
    ]);
  }

  return (
    <div className={styles.container}>
      {isSettingLocation && <button onClick={addPin}>Confirm</button>}
      {isSettingLocation && <button onClick={toggleIsSettingLocation} >Cancel</button>}

      {!isSettingLocation && <button onClick={toggleIsSettingLocation} >Set Location</button>}
    </div>
  )
}
