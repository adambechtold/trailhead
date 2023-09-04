export interface Overlay {
  url: string;
  bounds: number[][]; // [[lat, long], [lat, long]]
  center: number[]; // [lat, long]
}

export class Overlay {
  constructor(url: string, bounds: number[][]) {
    this.url = url;
    this.bounds = bounds;
    this.center = this.calculateCenter(bounds);
  }

  private calculateCenter = (bounds: number[][]) => {
    return [
      this.averageArray(bounds.map((bound) => bound[0])),
      this.averageArray(bounds.map((bound) => bound[1])),
    ];
  };

  private averageArray = (array: number[]) => {
    const sum = array.reduce((acc, curr) => acc + curr, 0);
    return sum / array.length;
  };
}
