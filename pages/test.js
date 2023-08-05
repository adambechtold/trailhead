import dynamic from 'next/dynamic';
import styles from '@/styles/Test.module.css';
import { getExamplePins } from '@/utils/plot';

const Plot = dynamic(() => import('@/components/Plot'), {
  ssr: false
});

export default function Test() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot
          className={styles.plot}
          pins={getExamplePins()}
          showOverlay={true}
        />
      </div>
      <div className={styles.plot}>
        <Plot
          className={styles.plot}
          pins={getExamplePins()}
          showOverlay={true}
        />
      </div>
    </div>
  );
}
