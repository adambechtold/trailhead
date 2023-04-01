import styles from '@/components/menu-tray.module.css';

export default function MenuTray({ isSettingLocation, setIsSettingLocation }) {

  const toggleIsSettingLocation = () => {
    setIsSettingLocation(!isSettingLocation);
  }

  return (
    <div className={styles.container}>
      {isSettingLocation && <button>Confirm</button>}
      {isSettingLocation && <button onClick={toggleIsSettingLocation} >Cancel</button>}

      {!isSettingLocation && <button onClick={toggleIsSettingLocation} >Set Location</button>}
    </div>
  )
}
