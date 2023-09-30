import { Coordinates, Pin, ReferencePin, Point, Vector } from "../types/Vector";

export function getUserPin(
  pin1: Pin,
  pin2: Pin,
  userCoordinates: Coordinates
): Pin {
  const pin1CoordinatesPoint = {
    x: pin1.location.coordinates.longitude,
    y: pin1.location.coordinates.latitude,
  };
  const pin2CoordinatesPoint = {
    x: pin2.location.coordinates.longitude,
    y: pin2.location.coordinates.latitude,
  };
  const userCoordinatesPoint = {
    x: userCoordinates.longitude,
    y: userCoordinates.latitude,
  };

  const userPin: Pin = {
    mapPoint: convertCoordinates(
      pin1.mapPoint,
      pin1CoordinatesPoint,
      pin2.mapPoint,
      pin2CoordinatesPoint,
      userCoordinatesPoint
    ),
    location: {
      coordinates: userCoordinates,
    },
  };

  return userPin;
}

export function convertCoordinates(
  // this seems to work, assuming that both coordinates systems are
  // oriented in the same direction
  A_C1: Point,
  A_C2: Point,
  B_C1: Point,
  B_C2: Point,
  new_C1: Point
): Point {
  const vector_AB_C1 = new Vector(B_C1.x - A_C1.x, B_C1.y - A_C1.y);
  const vector_AB_C2 = new Vector(B_C2.x - A_C2.x, B_C2.y - A_C2.y);
  const vector_AtoNew_C1 = new Vector(new_C1.x - A_C1.x, new_C1.y - A_C1.y);

  const xScaler = vector_AB_C2.x / vector_AB_C1.x;
  const yScaler = vector_AB_C2.y / vector_AB_C1.y;

  const new_C2: Point = {
    x: A_C2.x + vector_AtoNew_C1.x * xScaler,
    y: A_C2.y + vector_AtoNew_C1.y * yScaler,
  };

  return new_C2;
}

type ScalerStrategy = "MOST-X_MOST-Y" | "FIRST_TWO_POINTS";
type OriginStrategy = "FIRST_POINT" | "CLOSEST_POINT";
export type ConverstionStrategy = {
  scalerStrategy: ScalerStrategy;
  originStrategy: OriginStrategy;
};

export function convertPoint(
  referencePins: [ReferencePin, ReferencePin], // Known Points in both coordinate systems (A & B)
  newPoint: Point, // Point in the A coordinate system with unknown B coordinate
  converstionStrategy: ConverstionStrategy = {
    scalerStrategy: "FIRST_TWO_POINTS",
    originStrategy: "FIRST_POINT",
  }
): Point {
  let xScaler = 0;
  let yScaler = 0;
  let scalers;

  switch (converstionStrategy.scalerStrategy) {
    case "FIRST_TWO_POINTS":
      const vectorA = getVectorBetweenPoints(
        referencePins[0].aPoint,
        referencePins[1].aPoint
      );
      const vectorB = getVectorBetweenPoints(
        referencePins[0].bPoint,
        referencePins[1].bPoint
      );

      scalers = getScalers(vectorA, vectorB);
      xScaler = scalers.xScaler;
      yScaler = scalers.yScaler;
      break;
    case "MOST-X_MOST-Y":
      // - - - Find the two points that are farthest apart in each dimension in the A coordinate system - - -
      const [iX, jX] = getIndiciesOfFarthestTwoPoints(
        referencePins.map((pin) => pin.aPoint),
        "x"
      );
      const [iY, jY] = getIndiciesOfFarthestTwoPoints(
        referencePins.map((pin) => pin.aPoint),
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
      scalers = getScalers(vectorXA, vectorXB);
      xScaler = scalers.xScaler;

      // - - - Get the Y scaler from the two points that are farthest apart in the Y dimension - - -
      const vectorYA = getVectorBetweenPoints(
        referencePins[iY].aPoint,
        referencePins[jY].aPoint
      );
      const vectorYB = getVectorBetweenPoints(
        referencePins[iY].bPoint,
        referencePins[jY].bPoint
      );
      scalers = getScalers(vectorYA, vectorYB);
      yScaler = scalers.yScaler;
      break;
    default:
      throw new Error("Invalid scaler strategy");
  }

  let origin: ReferencePin = referencePins[0];

  switch (converstionStrategy.originStrategy) {
    case "FIRST_POINT":
      origin = referencePins[0];
      break;
    case "CLOSEST_POINT":
      const indexOfClosestReferencePin = getIndexOfClosestPoint(
        newPoint,
        referencePins.map((pin) => pin.aPoint)
      );
      console.log("closest pins is", indexOfClosestReferencePin);
      origin = referencePins[indexOfClosestReferencePin];
      break;
    default:
      throw new Error("Invalid origin strategy");
  }

  const vector_originToNew_CA = getVectorBetweenPoints(origin.aPoint, newPoint);
  console.log("vector_originToNew_CA", vector_originToNew_CA);

  const newPoint_CB: Point = {
    x: origin.bPoint.x + vector_originToNew_CA.x * xScaler,
    y: origin.bPoint.y + vector_originToNew_CA.y * yScaler,
  };

  return newPoint_CB;
}

function getIndexOfClosestPoint(originPoint: Point, points: Point[]): number {
  if (points.length < 1) {
    return -1;
  }

  let closestPoint = points[0];
  let closestPointIndex = 0;
  let closestDistance = getDistanceBetweenPoints(originPoint, closestPoint);

  for (let i = 1; i < points.length; i++) {
    const distance = getDistanceBetweenPoints(originPoint, points[i]);
    if (distance < closestDistance) {
      closestPoint = points[i];
      closestPointIndex = i;
      closestDistance = distance;
    }
  }

  return closestPointIndex;
}

type Dimension = "x" | "y";
function getIndiciesOfFarthestTwoPoints(
  points: Point[],
  dimension: Dimension
): [number, number] {
  if (points.length < 2) {
    throw new Error("Must provide at least two points");
  }

  let farthestPoints = [0, 1];
  let farthestDistance = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = Math.abs(points[i][dimension] - points[j][dimension]);
      if (distance > farthestDistance) {
        farthestPoints[0] = i;
        farthestPoints[1] = j;
        farthestDistance = distance;
      }
    }
  }

  return farthestPoints as [number, number];
}

function getVectorBetweenPoints(pointA: Point, pointB: Point): Vector {
  return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
}

function getScalers(
  vectorA: Vector,
  vectorB: Vector
): { xScaler: number; yScaler: number } {
  const xScaler = vectorB.x / vectorA.x;
  const yScaler = vectorB.y / vectorA.y;

  return { xScaler, yScaler };
}

function getDistanceBetweenPoints(point1: Point, point2: Point) {
  const vector = getVectorBetweenPoints(point1, point2);
  return vector.length;
}

export const createReferenecPin = (pin: Pin): ReferencePin => ({
  aPoint: {
    x: pin.location.coordinates.longitude,
    y: pin.location.coordinates.latitude,
  },
  bPoint: pin.mapPoint,
});
