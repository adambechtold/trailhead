import { Pin, Point, Vector, Location, Coordinates } from "../types/Vector";

export function getUserPin(start: Pin, end: Pin, userLocation: Location) {
  const startCoordinatesPoint: Point = {
    x: start.location.coordinates.longitude,
    y: start.location.coordinates.latitude,
  };
  const endCoordinatesPoint: Point = {
    x: end.location.coordinates.longitude,
    y: end.location.coordinates.latitude,
  };
  const userLocationCoordinatesPoint: Point = {
    x: userLocation.coordinates.longitude,
    y: userLocation.coordinates.latitude,
  };

  const { x, y } = convertCoordinates(
    startCoordinatesPoint,
    start.mapPoint,
    endCoordinatesPoint,
    end.mapPoint,
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

export function getCoordinatesFromMapPoint(
  start: Pin,
  end: Pin,
  point: Point
): Coordinates {
  const startCoordinatesPoint: Point = {
    x: start.location.coordinates.longitude,
    y: start.location.coordinates.latitude,
  };
  const endCoordinatesPoint: Point = {
    x: end.location.coordinates.longitude,
    y: end.location.coordinates.latitude,
  };

  const { x, y } = convertCoordinates(
    start.mapPoint,
    startCoordinatesPoint,
    end.mapPoint,
    endCoordinatesPoint,
    point
  );

  return {
    longitude: x,
    latitude: y,
  };
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
