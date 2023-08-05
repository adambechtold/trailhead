import dynamic from 'next/dynamic';
import styles from '@/styles/Test.module.css';
import { getExamplePins } from '@/utils/map';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false
});

export default function Test() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <LeafletMap
          className={styles.plot}
          pins={getExamplePins()}
          showOverlay={true}
        />
      </div>
      <div className={styles.plot}>
        <LeafletMap
          className={styles.plot}
          pins={getExamplePins()}
          showOverlay={true}
        />
      </div>
    </div>
  );
}
