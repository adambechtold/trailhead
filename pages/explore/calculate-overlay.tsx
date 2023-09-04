import dynamic from "next/dynamic";
import styles from "./overlay.module.css";
import { Overlay } from "@/types/Overlay";
import { Pin, Point, Coordinates } from "@/types/Vector";
import { convertCoordinates } from "@/utils/vector";

const Plot = dynamic(() => import("@/components/Plot"), {
  ssr: false,
});

const overlayURL = "/images/trailmap-timberlands-precise-1.jpeg";
const actualOverlayBounds = [
  [41.3545, -72.6965],
  [41.3289, -72.6666],
];

let overlay = new Overlay(overlayURL, actualOverlayBounds);

const start: Pin = {
  mapPoint: {
    x: -497.018,
    y: -799.78,
  },
  coordinates: {
    longitude: -72.68157,
    latitude: 41.33673,
  },
};
const end: Pin = {
  mapPoint: {
    x: -442.47,
    y: -686.14,
  },
  coordinates: {
    longitude: -72.6841,
    latitude: 41.33866,
  },
};

let upperLeftMapPoint: Point = {
  x: 0,
  y: 0,
};
let lowerRightMapPoint: Point = {
  x: -996,
  y: -1152,
};

let { x, y } = convertCoordinates(
  start.mapPoint,
  {
    x: start.coordinates.longitude,
    y: start.coordinates.latitude,
  },
  end.mapPoint,
  {
    x: end.coordinates.longitude,
    y: end.coordinates.latitude,
  },
  upperLeftMapPoint
);
const upperLeft: Pin = {
  mapPoint: upperLeftMapPoint,
  coordinates: {
    longitude: x,
    latitude: y,
  },
};

({ x, y } = convertCoordinates(
  start.mapPoint,
  {
    x: start.coordinates.longitude,
    y: start.coordinates.latitude,
  },
  end.mapPoint,
  {
    x: end.coordinates.longitude,
    y: end.coordinates.latitude,
  },
  lowerRightMapPoint
));
const lowerRight: Pin = {
  mapPoint: lowerRightMapPoint,
  coordinates: {
    longitude: x,
    latitude: y,
  },
};

overlay = new Overlay(overlayURL, [
  [upperLeft.coordinates.latitude, upperLeft.coordinates.longitude],
  [lowerRight.coordinates.latitude, lowerRight.coordinates.longitude],
]);

const path: Coordinates[] = [
  {
    latitude: start.coordinates.latitude,
    longitude: start.coordinates.longitude,
  },
  {
    latitude: end.coordinates.latitude,
    longitude: end.coordinates.longitude,
  },
  {
    latitude: upperLeft.coordinates.latitude,
    longitude: upperLeft.coordinates.longitude,
  },
  {
    latitude: lowerRight.coordinates.latitude,
    longitude: lowerRight.coordinates.longitude,
  },
];

export default function CalculateOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot overlay={overlay} path={path} />
      </div>
    </div>
  );
}
