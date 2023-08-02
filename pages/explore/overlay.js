import dynamic from 'next/dynamic';
import styles from './overlay.module.css';
import { getExamplePins } from '@/utils/plot';

const Plot = dynamic(() => import('@/components/Plot'), {
  ssr: false
});

export default function ExploreOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot 
          showOverlay={true}
          pins={getExamplePins()}
        />
      </div>
    </div>
  );
}