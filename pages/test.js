import dynamic from 'next/dynamic';

import styles from '@/styles/Test.module.css';

const Plot = dynamic(() => import('@/components/Plot'), {
  ssr: false
});

export default function Test() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot />
      </div>
      <div className={styles.plot}>
        <Plot />
      </div>
    </div>
  );
}