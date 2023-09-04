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

const initialCoordinates = [
  {
    latitude: 41.33673,
    longitude: -72.68157,
  },
  {
    latitude: 41.33866,
    longitude: -72.6841,
  },
];

export const getExampleCoordinates = () =>
  getLineOfCoordinates(initialCoordinates[0], initialCoordinates[1], 6);
