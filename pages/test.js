import Head from 'next/head';
import styles from '@/styles/Test.module.css'

import Plot from '@/components/Plot';



export default function Test() {
  return (
    <>
      <Head>
        <title>Test</title>
        <meta name='description' content='Tools to Test Wander' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className={styles.container}>
        <Plot name='Input Coordinates' />
        <Plot name='Output' />
      </div>
    </>
  );
}