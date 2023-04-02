import { useEffect, useRef } from 'react';

import styles from '@/components/crosshairs.module.css';

export default function Crosshairs({ setCrosshairsPosition }) {
  
  const centerPointReference = useRef(null);

  function getCenter(centerPointReference) {
    const centerPointNode = centerPointReference.current;
    const centerPointRect = centerPointNode.getBoundingClientRect();
    const { x, y, width, height } = centerPointRect;
    return { x, y, width, height };
  }

  useEffect(() => {
    const {x, y, width, height } = getCenter(centerPointReference);
    setCrosshairsPosition({
      x: x + width / 2,
      y: y + height / 2
    });
  }, [centerPointReference]);

  return (
    <div className={styles.container}>
      <div className={styles.centerPoint} ref={centerPointReference} />
      <div className={styles.horizontalLine} />
      <div className={styles.verticalLine} />
    </div>
  )
}
