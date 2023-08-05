import dynamic from 'next/dynamic';
import styles from './overlay.module.css';
import { getExamplePins } from '@/utils/map';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false
});

export default function ExploreOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <LeafletMap 
          showOverlay={true}
          pins={getExamplePins()}
        />
      </div>
    </div>
  );
}