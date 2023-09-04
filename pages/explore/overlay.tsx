import dynamic from "next/dynamic";
import styles from "./overlay.module.css";
import { getExampleCoordinates } from "@/utils/plot";
import { Overlay } from "@/types/Overlay";

const Plot = dynamic(() => import("@/components/Plot"), {
  ssr: false,
});

const overlay1 = new Overlay("../images/trailmap-timberlands-precise-1.jpeg", [
  [41.3545, -72.6965],
  [41.3289, -72.6666],
]);
const overlay2 = new Overlay("../images/trailmap-timberlands-precise-2.jpeg", [
  [41.35422, -72.6926],
  [41.328, -72.66833],
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
