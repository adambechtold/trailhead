import dynamic from "next/dynamic";
import styles from "@/styles/Test.module.css";
import { getExampleCoordinates } from "@/utils/plot";

const Plot = dynamic(() => import("@/components/Plot"), {
  ssr: false,
});

export default function Test() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot path={getExampleCoordinates()} />
      </div>
    </div>
  );
}
