import { Pin } from "@/types/Vector";

export type Configuration = {
  pins: Pin[];
  url: string;
  actualBounds: number[][]; // [topLeft, bottomRight]
};

const overlayURL = "/images/trailmap-timberlands-precise-1.jpeg";
const actualOverlayBounds = [
  [41.3545, -72.6965],
  [41.3289, -72.6666],
];

export const configurations: Configuration[] = [
  {
    pins: [
      {
        mapPoint: {
          x: 497.018,
          y: -799.78,
        },
        location: {
          coordinates: {
            longitude: -72.68157,
            latitude: 41.33673,
          },
        },
      },
      {
        mapPoint: {
          x: 442.47,
          y: -686.14,
        },
        location: {
          coordinates: {
            longitude: -72.6841,
            latitude: 41.33866,
          },
        },
      },
    ],
    url: overlayURL,
    actualBounds: actualOverlayBounds,
  },
  {
    pins: [
      {
        mapPoint: {
          x: 895.709,
          y: -1045.019,
        },
        location: {
          coordinates: {
            latitude: 41.33125, //  top: 1045.019 → -y
            longitude: -72.6696, // left: 895.709 →  x
          },
        },
      },
      {
        mapPoint: {
          x: 336.269,
          y: -290.429,
        },
        location: {
          coordinates: {
            latitude: 41.348, //     top: 290.429
            longitude: -72.6864, // left: 336.269
          },
        },
      },
    ],
    url: overlayURL,
    actualBounds: actualOverlayBounds,
  },
  {
    // wide and call downwards
    pins: [
      {
        mapPoint: {
          x: 743.788,
          y: -323.424,
        },
        location: {
          coordinates: {
            latitude: 41.3473, //     top: 323.424 → -y
            longitude: -72.67417, // left: 743.788 →  x
          },
        },
      },
      {
        mapPoint: {
          x: 315.211,
          y: -742.866,
        },
        location: {
          coordinates: {
            latitude: 41.338, //    top: 742.866 → -y
            longitude: -72.687, // left: 315.211 →  x
          },
        },
      },
    ],
    url: overlayURL,
    actualBounds: actualOverlayBounds,
  },
  {
    // very narrow vertical, upwards
    pins: [
      {
        mapPoint: {
          x: 517.384,
          y: -796.535,
        },
        location: {
          coordinates: {
            latitude: 41.3368, //   top: 796.535 → -y
            longitude: -72.681, // left: 517.384 →  x
          },
        },
      },
      {
        mapPoint: {
          x: 458.658,
          y: -508.953,
        },
        location: {
          coordinates: {
            latitude: 41.34322, //    top: 508.953 → -y
            longitude: -72.68266, // left: 458.658 →  x
          },
        },
      },
    ],
    url: overlayURL,
    actualBounds: actualOverlayBounds,
  },
];
