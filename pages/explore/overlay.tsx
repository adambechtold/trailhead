import { Overlay } from "@/types/Overlay";
import dynamic from "next/dynamic";
import { getExampleCoordinates } from "@/utils/plot";
import styles from "./overlay.module.css";

const Plot = dynamic(() => import("@/components/Plot"), {
  ssr: false,
});

const overlay1 = new Overlay("../images/trailmap-timberlands-precise-1.jpeg", [
  [41.3545, -72.6965],
  [41.3289, -72.6666],
]);

export default function ExploreOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot overlay={overlay1} path={getExampleCoordinates()} />
      </div>
    </div>
  );
}
