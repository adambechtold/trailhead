import { Pin, Point, Vector, Location, Coordinates } from "../types/Vector";

export function getUserPin(pins: Pin[], userLocation: Location) {
  if (pins.length < 2) {
    throw new Error("Not enough pins to calculate user pin");
  }

  const referencePins = pins.map(convertPinToReferencePoint);
  const userLocationCoordinatesPoint: Point = {
    x: userLocation.coordinates.longitude,
    y: userLocation.coordinates.latitude,
  };

  const { x, y } = convertCoordinates(
    referencePins,
    userLocationCoordinatesPoint
  );

  const userPin: Pin = {
    mapPoint: {
      x,
      y,
    },
    location: {
      coordinates: {
        longitude: userLocation.coordinates.longitude,
        latitude: userLocation.coordinates.latitude,
      },
    },
  };

  return userPin;
}

type ReferencePin = {
  aPoint: Point;
  bPoint: Point;
};
function convertPinToReferencePoint(pin: Pin): ReferencePin {
  return {
    aPoint: {
      x: pin.location.coordinates.longitude,
      y: pin.location.coordinates.latitude,
    },
    bPoint: pin.mapPoint,
  };
}

export function getCoordinatesFromMapPoint(
  pins: Pin[],
  point: Point
): Coordinates {
  const referencePins = pins.map(convertPinToReferencePoint);

  const { x, y } = convertCoordinates(referencePins, point);

  return {
    longitude: x,
    latitude: y,
  };
}

export function convertCoordinates(
  // this seems to work, assuming that both coordinates systems are
  // oriented in the same direction
  referencePins: ReferencePin[],
  new_aPoint: Point
): Point {
  if (referencePins.length < 2) {
    throw new Error("Not enough pins to convert coordinates");
  }
  const [iX, jX] = getIndicesOfFarthestTwoPoints(
    referencePins.map((pin) => pin.bPoint),
    "x"
  );
  const [iY, jY] = getIndicesOfFarthestTwoPoints(
    referencePins.map((pin) => pin.bPoint),
    "y"
  );

  // - - - Get the X scaler from the two points that are farthest apart in the X dimension - - -
  const vectorXA = getVectorBetweenPoints(
    referencePins[iX].aPoint,
    referencePins[jX].aPoint
  );
  const vectorXB = getVectorBetweenPoints(
    referencePins[iY].bPoint,
    referencePins[jY].bPoint
  );
  const xScaler = getScalers(vectorXA, vectorXB).x;

  // - - - Get the Y scaler from the two points that are farthest apart in the Y dimension - - -
  const vectorYA = getVectorBetweenPoints(
    referencePins[iY].aPoint,
    referencePins[jY].aPoint
  );
  const vectorYB = getVectorBetweenPoints(
    referencePins[iY].bPoint,
    referencePins[jY].bPoint
  );
  const yScaler = getScalers(vectorYA, vectorYB).y;

  // Find the closest point to the new point
  const indexOfClosetPoint = getIndexOfClosestPoint(
    new_aPoint,
    referencePins.map((pin) => pin.aPoint)
  );
  const origin = referencePins[indexOfClosetPoint];

  const vectorOriginToNew_CA = getVectorBetweenPoints(
    origin.aPoint,
    new_aPoint
  );

  const new_bPoint: Point = {
    x: origin.bPoint.x + vectorOriginToNew_CA.x * xScaler,
    y: origin.bPoint.y + vectorOriginToNew_CA.y * yScaler,
  };

  return new_bPoint;
}

function getIndicesOfFarthestTwoPoints(
  points: Point[],
  dimension: "x" | "y"
): [number, number] {
  if (points.length < 2) {
    throw new Error("Not enough points to calculate farthest two points");
  }

  let farthestPoints: [number, number] = [0, 1];
  let farthestDistance = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = Math.abs(points[i][dimension] - points[j][dimension]);
      if (distance > farthestDistance) {
        farthestPoints = [i, j];
        farthestDistance = distance;
      }
    }
  }

  return farthestPoints;
}

function getVectorBetweenPoints(pointA: Point, pointB: Point): Vector {
  return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
}

function getScalers(
  vectorA: Vector,
  vectorB: Vector
): { x: number; y: number } {
  return {
    x: vectorB.x / vectorA.x,
    y: vectorB.y / vectorA.y,
  };
}

function getIndexOfClosestPoint(originPoint: Point, points: Point[]): number {
  if (points.length < 1) {
    return -1;
  }

  let closestPointIndex = 0;
  let closestDistance = getDistanceBetweenPoints(originPoint, points[0]);

  for (let i = 1; i < points.length; i++) {
    const distance = getDistanceBetweenPoints(originPoint, points[i]);
    if (distance < closestDistance) {
      closestPointIndex = i;
      closestDistance = distance;
    }
  }

  return closestPointIndex;
}

function getDistanceBetweenPoints(point1: Point, point2: Point) {
  const vector = getVectorBetweenPoints(point1, point2);
  return vector.length;
}
