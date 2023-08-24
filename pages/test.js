import dynamic from 'next/dynamic';
import styles from '@/styles/Test.module.css';
import { getExamplePins, exampleOverlays } from '@/utils/map';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false
});

const InterpolatedMap = dynamic(() => import('@/components/InterpolatedMap'), {
  ssr: false
});

const imageUrl = exampleOverlays[0].url;

export default function Test() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <LeafletMap
          pins={getExamplePins()}
          showOverlay={true}
        />
      </div>
      <div className={styles.plot}>
        <InterpolatedMap
          imageUrl={imageUrl}
          pins={getExamplePins()}
        />
      </div>
    </div>
  );
}
