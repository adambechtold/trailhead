export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type Location = {
  coordinates: Coordinates;
  accuracy?: number; // if not provided, assume perfect accuracy
};

export type Point = {
  x: number;
  y: number;
};

export type Pin = {
  mapPoint: Point;
  location: Location;
  index?: number;
};

export interface Vector {
  x: number;
  y: number;
  length: number;
  angleRadians: number;
  angleDegrees: number;
}

export class Vector {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.length = this.calculateLength(x, y);
    this.angleRadians = this.calculateAngle(x, y);
    this.angleDegrees = this.angleRadians * (180 / Math.PI);
  }

  private calculateLength(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  private calculateAngle(x: number, y: number): number {
    return Math.atan2(y, x);
  }
}
