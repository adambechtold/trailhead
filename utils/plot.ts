import { Coordinates } from "@/types/Vector";

export const getLineOfCoordinates = (
  startPosition: Coordinates,
  endPosition: Coordinates,
  numberOfPoints: number
): Coordinates[] => {
  if (numberOfPoints < 2) {
    throw new Error("numberOfPoints must be greater than 1");
  }

  const line = [];
  const latDiff =
    (endPosition.latitude - startPosition.latitude) / (numberOfPoints - 1);
  const longDiff =
    (endPosition.longitude - startPosition.longitude) / (numberOfPoints - 1);
  for (let i = 0; i < numberOfPoints; i++) {
    line.push({
      latitude: startPosition.latitude + latDiff * i,
      longitude: startPosition.longitude + longDiff * i,
    });
  }

  return line;
};

const getExampleCoordinates1 = () =>
  // short and stout, upwards
  getLineOfCoordinates(
    {
      latitude: 41.33673,
      longitude: -72.68157,
    },
    {
      latitude: 41.33866,
      longitude: -72.6841,
    },
    6
  );

const getExampleCoordinates2 = () =>
  // wide and tall, upwards
  getLineOfCoordinates(
    {
      latitude: 41.33125, //  top: 1045.019 → -y
      longitude: -72.6696, // left: 895.709 →  x
    },
    {
      latitude: 41.348, //     top: 290.429
      longitude: -72.6864, // left: 336.269
    },
    6
  );

const getExampleCoordinates3 = () =>
  // wide and tall, downwards
  getLineOfCoordinates(
    {
      latitude: 41.3473,
      longitude: -72.67417,
    },
    {
      latitude: 41.338,
      longitude: -72.687,
    },
    6
  );

const getExampleCoordinates4 = () =>
  // very narrow vertical, upwards
  getLineOfCoordinates(
    {
      latitude: 41.3368, //   top: 323.424 → -y
      longitude: -72.681, // left: 743.788 →  x
    },
    {
      latitude: 41.34322, //    top: 742.867
      longitude: -72.68266, // left: 315.211
    },
    6
  );

export const getExampleCoordinates = getExampleCoordinates4;
