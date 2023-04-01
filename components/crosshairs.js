
import styles from '@/components/crosshairs.module.css';

export default function Crosshairs() {
  return (
    <div className={styles.container}>
      <div className={styles.horizontalLine} />
      <div className={styles.verticalLine} />
    </div>
  )
}
