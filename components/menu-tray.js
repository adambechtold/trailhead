import styles from '@/components/menu-tray.module.css';

export default function MenuTray() {

  return (
    <div className={styles.container}>
      <button>Confirm</button>
      <button>Cancel</button>
    </div>
  )
}
