
import styles from '@/components/Plot.module.css';

export default function TestMap({
  name
}) {

  return (
    <div className={styles.container}>
      <div className={styles.plot}></div>
      <p>{name}</p>
    </div>

  )
}