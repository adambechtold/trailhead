import { Coordinates, Pin, Point, Vector } from "../types/Vector";

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
