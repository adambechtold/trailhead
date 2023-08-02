import dynamic from 'next/dynamic';
import styles from '@/styles/Test.module.css';
import { getLineOfPins } from '@/utils/plot';

const Plot = dynamic(() => import('@/components/Plot'), {
  ssr: false
});

const initialPins = [{
  index: 1,
  latitude: 41.33673,
  longitude: -72.68157,
}, {
  index: 2,
  latitude: 41.3398,
  longitude: -72.68334
}];

const pins = getLineOfPins({
  startPosition: initialPins[0],
  endPosition: initialPins[1],
  numberOfPins: 8
});

export default function Test() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot
          pins={pins}
        />
      </div>
    </div>
  );
}
