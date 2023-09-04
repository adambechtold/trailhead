import dynamic from "next/dynamic";
import styles from "./calculate-overlay.module.css";
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

const start1: Pin = {
  mapPoint: {
    x: 497.018,
    y: -799.78,
  },
  coordinates: {
    longitude: -72.68157,
    latitude: 41.33673,
  },
};
const end1: Pin = {
  mapPoint: {
    x: 442.47,
    y: -686.14,
  },
  coordinates: {
    longitude: -72.6841,
    latitude: 41.33866,
  },
};

const start2: Pin = {
  mapPoint: {
    x: 895.709,
    y: -1045.019,
  },
  coordinates: {
    latitude: 41.33125, //  top: 1045.019 → -y
    longitude: -72.6696, // left: 895.709 →  x
  },
};
const end2: Pin = {
  mapPoint: {
    x: 336.269,
    y: -290.429,
  },
  coordinates: {
    latitude: 41.348, //     top: 290.429
    longitude: -72.6864, // left: 336.269
  },
};

function createOverlay(start: Pin, end: Pin, overlayURL: string): Overlay {
  let upperLeftMapPoint: Point = {
    x: 0,
    y: 0,
  };
  let lowerRightMapPoint: Point = {
    x: 996,
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

  const overlay = new Overlay(overlayURL, [
    [upperLeft.coordinates.latitude, upperLeft.coordinates.longitude],
    [lowerRight.coordinates.latitude, lowerRight.coordinates.longitude],
  ]);

  return overlay;
}

const overlay1 = createOverlay(start1, end1, overlayURL);
const overlay2 = createOverlay(start2, end2, overlayURL);

const path1: Coordinates[] = [
  {
    latitude: start1.coordinates.latitude,
    longitude: start1.coordinates.longitude,
  },
  {
    latitude: end1.coordinates.latitude,
    longitude: end1.coordinates.longitude,
  },
  {
    // upper left 1
    latitude: overlay1.bounds[0][0],
    longitude: overlay1.bounds[0][1],
  },
  {
    // lower right 1
    latitude: overlay1.bounds[1][0],
    longitude: overlay1.bounds[1][1],
  },
  {
    latitude: actualOverlayBounds[0][0],
    longitude: actualOverlayBounds[0][1],
  },
  {
    latitude: actualOverlayBounds[1][0],
    longitude: actualOverlayBounds[1][1],
  },
];

const path2: Coordinates[] = [
  {
    latitude: start2.coordinates.latitude,
    longitude: start2.coordinates.longitude,
  },
  {
    latitude: end2.coordinates.latitude,
    longitude: end2.coordinates.longitude,
  },
  {
    // upper left 1
    latitude: overlay2.bounds[0][0],
    longitude: overlay2.bounds[0][1],
  },
  {
    // lower right 1
    latitude: overlay2.bounds[1][0],
    longitude: overlay2.bounds[1][1],
  },
  path1[4],
  path1[5],
];

export default function CalculateOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Plot overlay={overlay1} path={path1} />
      </div>
      <div className={styles.plot}>
        <Plot overlay={overlay2} path={path2} />
      </div>
    </div>
  );
}
