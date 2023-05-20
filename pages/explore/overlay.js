import dynamic from 'next/dynamic';

import styles from './overlay.module.css';

const Plot = dynamic(() => import('@/components/Plot'), {
  ssr: false
});

export default function ExploreOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot showOverlay={true}/>
      </div>
    </div>
  );
}