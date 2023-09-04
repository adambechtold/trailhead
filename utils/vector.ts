import { Coordinates, Pin, Point, Vector } from "../types/Vector";

export function getUserPin(
  pin1: Pin,
  pin2: Pin,
  userCoordinates: Coordinates
): Pin {
  const pin1CoordinatesPoint = {
    x: pin1.coordinates.longitude,
    y: pin1.coordinates.latitude,
  };
  const pin2CoordinatesPoint = {
    x: pin2.coordinates.longitude,
    y: pin2.coordinates.latitude,
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
    coordinates: userCoordinates,
  };

  return userPin;
}

export function convertCoordinates(
  A_C1: Point,
  A_C2: Point,
  B_C1: Point,
  B_C2: Point,
  new_C1: Point
): Point {
  const vector_AB_C1 = new Vector(B_C1.x - A_C1.x, B_C1.y - A_C1.y);
  const vector_AB_C2 = new Vector(B_C2.x - A_C2.x, B_C2.y - A_C2.y);
  const vector_AtoNew_C1 = new Vector(new_C1.x - A_C1.x, new_C1.y - A_C1.y);

  const length_AtoNew_C1 = vector_AtoNew_C1.length;
  const length_AB_C1 = vector_AB_C1.length;
  const length_AB_C2 = vector_AB_C2.length;

  const length_AtoNew_C2 = length_AtoNew_C1 * (length_AB_C2 / length_AB_C1);

  const vector_AtoNew_C2 = new Vector(
    length_AtoNew_C2 * Math.cos(vector_AtoNew_C1.angleRadians),
    length_AtoNew_C2 * Math.sin(vector_AtoNew_C1.angleRadians)
  );

  const new_C2: Point = {
    x: A_C2.x + vector_AtoNew_C2.x,
    y: A_C2.y + vector_AtoNew_C2.y,
  };

  return new_C2;
}

function convertCoordinatesGPT(
  A_C1: Point,
  A_C2: Point,
  B_C1: Point,
  B_C2: Point,
  new_C1: Point
): Point {
  const vector_AB_C1 = new Vector(B_C1.x - A_C1.x, B_C1.y - A_C1.y);
  const vector_AB_C2 = new Vector(B_C2.x - A_C2.x, B_C2.y - A_C2.y);
  const vector_AtoNew_C1 = new Vector(new_C1.x - A_C1.x, new_C1.y - A_C1.y);

  const angleBetweenVectors: number =
    Math.atan2(vector_AtoNew_C1.y, vector_AtoNew_C1.y) -
    Math.atan2(vector_AB_C1.y, vector_AB_C1.x);

  const length_AtoNew_C1 = vector_AtoNew_C1.length;
  const length_AB_C1 = vector_AB_C1.length;
  const length_AB_C2 = vector_AB_C2.length;
  const length_AtoNew_C2 =
    length_AtoNew_C1 *
    Math.cos(angleBetweenVectors) *
    (length_AB_C2 / length_AB_C1);

  const vector_AtoNew_C2 = new Vector(
    vector_AB_C2.x * (length_AtoNew_C2 / length_AB_C2),
    vector_AB_C2.y * (length_AtoNew_C2 / length_AB_C2)
  );

  const new_C2: Point = {
    x: A_C2.x + vector_AtoNew_C2.x,
    y: A_C2.y + vector_AtoNew_C2.y,
  };

  return new_C2;
}
