import dynamic from "next/dynamic";
import styles from "./calculate-overlay.module.css";
import { Overlay } from "@/types/Overlay";
import { Pin, Point, Coordinates } from "@/types/Vector";
import { convertCoordinates } from "@/utils/vector";

import { configurations, Configuration } from "@/types/overlay.configurations";

const Plot = dynamic(() => import("@/components/Plot"), {
  ssr: false,
});

function createOverlay(pins: [Pin, Pin], overlayURL: string): Overlay {
  let upperLeftMapPoint: Point = {
    x: 0,
    y: 0,
  };
  let lowerRightMapPoint: Point = {
    x: 996,
    y: -1152,
  };

  let { x, y } = convertCoordinates(
    [
      {
        aPoint: pins[0].mapPoint,
        bPoint: {
          x: pins[0].location.coordinates.longitude,
          y: pins[0].location.coordinates.latitude,
        },
      },
      {
        aPoint: pins[1].mapPoint,
        bPoint: {
          x: pins[1].location.coordinates.longitude,
          y: pins[1].location.coordinates.latitude,
        },
      },
    ],
    upperLeftMapPoint
  );
  const upperLeft: Pin = {
    mapPoint: upperLeftMapPoint,
    location: {
      coordinates: {
        longitude: x,
        latitude: y,
      },
    },
  };

  ({ x, y } = convertCoordinates(
    [
      {
        aPoint: pins[0].mapPoint,
        bPoint: {
          x: pins[0].location.coordinates.longitude,
          y: pins[0].location.coordinates.latitude,
        },
      },
      {
        aPoint: pins[1].mapPoint,
        bPoint: {
          x: pins[1].location.coordinates.longitude,
          y: pins[1].location.coordinates.latitude,
        },
      },
    ],
    lowerRightMapPoint
  ));
  const lowerRight: Pin = {
    mapPoint: lowerRightMapPoint,
    location: {
      coordinates: {
        longitude: x,
        latitude: y,
      },
    },
  };

  const overlay = new Overlay(overlayURL, [
    [
      upperLeft.location.coordinates.latitude,
      upperLeft.location.coordinates.longitude,
    ],
    [
      lowerRight.location.coordinates.latitude,
      lowerRight.location.coordinates.longitude,
    ],
  ]);

  return overlay;
}

type Path = Coordinates[];
function generatePath(configuration: Configuration): Path {
  const { pins, url, actualBounds } = configuration;

  const overlay = createOverlay([pins[0], pins[1]], url);

  return [
    {
      latitude: pins[0].location.coordinates.latitude,
      longitude: pins[0].location.coordinates.longitude,
    },
    {
      latitude: pins[1].location.coordinates.latitude,
      longitude: pins[1].location.coordinates.longitude,
    },
    {
      latitude: overlay.bounds[0][0],
      longitude: overlay.bounds[0][1],
    },
    {
      latitude: overlay.bounds[1][0],
      longitude: overlay.bounds[1][1],
    },
    {
      latitude: actualBounds[0][0],
      longitude: actualBounds[0][1],
    },
  ];
}

const content = configurations.map((configuration, index) => {
  const path = generatePath(configuration);
  const overlay = createOverlay(
    [configuration.pins[0], configuration.pins[1]],
    configuration.url
  );
  return { path, overlay, index };
});

export default function CalculateOverlay() {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div className={styles.plot}>
          ✅ Short and Stout, Upwards
          <Plot path={content[0].path} overlay={content[0].overlay} />
        </div>
        <div className={styles.plot}>
          ✅ Wide and Tall, Upwards
          <Plot path={content[1].path} overlay={content[1].overlay} />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.plot}>
          ✅ Wide and Tall, Downwards
          <Plot path={content[2].path} overlay={content[2].overlay} />
        </div>
        <div className={styles.plot}>
          ✅ Very Narrow, Vertical, Upwards
          <Plot path={content[3].path} overlay={content[3].overlay} />
        </div>
      </div>
    </div>
  );
}
