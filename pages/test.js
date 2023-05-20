import Head from 'next/head';
import styles from '@/styles/Test.module.css'

import dynamic from 'next/dynamic';


const Plot = dynamic(() => import('@/components/Plot'), {
  ssr: false
});

export default function Test() {
  return (
    <>
      <Head>
        <title>Test</title>
        <meta name='description' content='Tools to Test Wander' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <div className={styles.container}>
        <Plot />      
      </div>
    </>
  );
}