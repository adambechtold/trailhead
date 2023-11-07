import { Point } from "../../types/Vector";
import { convertCoordinates } from "../vector";

describe("convertCoordinates", () => {
  test("converts identity coordinates", () => {
    const referencePins = [
      {
        aPoint: { x: 0, y: 0 },
        bPoint: { x: 0, y: 0 },
      },
      {
        aPoint: { x: 1, y: 1 },
        bPoint: { x: 1, y: 1 },
      },
      {
        aPoint: { x: 2, y: 2 },
        bPoint: { x: 2, y: 2 },
      },
    ];

    let new_aPoint: Point = { x: 2, y: 2 };
    let result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(2, 2);
    expect(result.y).toBeCloseTo(2, 2);

    new_aPoint = { x: 1, y: 1 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(1, 2);
    expect(result.y).toBeCloseTo(1, 2);

    new_aPoint = { x: 0, y: 0 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(0, 2);
    expect(result.y).toBeCloseTo(0, 2);

    new_aPoint = { x: -1, y: -1 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(-1, 2);
    expect(result.y).toBeCloseTo(-1, 2);

    new_aPoint = { x: -2, y: -3 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(-2, 2);
    expect(result.y).toBeCloseTo(-3, 2);

    new_aPoint = { x: -3.23, y: 0 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(-3.23, 3);
    expect(result.y).toBeCloseTo(0, 2);

    new_aPoint = { x: 0, y: -10.239 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(0, 2);
    expect(result.y).toBeCloseTo(-10.239, 4);
  });

  // different scale
  test("converts coordinates with different scale", () => {
    let referencePins = [
      { aPoint: { x: 0, y: 0 }, bPoint: { x: 0, y: 0 } },
      { aPoint: { x: 1, y: 1 }, bPoint: { x: 2, y: 2 } },
      { aPoint: { x: 2, y: 2 }, bPoint: { x: 4, y: 4 } },
    ];

    let new_aPoint: Point = { x: 2, y: 2 };
    let result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(4, 2);
    expect(result.y).toBeCloseTo(4, 2);

    new_aPoint = { x: 1, y: 4 };
    result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(2, 2);
    expect(result.y).toBeCloseTo(8, 2);
  });

  // different scale for each dimension
  test("converts coordinates with different scale for each dimension", () => {
    let referencePins = [
      { aPoint: { x: 0, y: 0 }, bPoint: { x: 0, y: 0 } },
      { aPoint: { x: 1, y: 1 }, bPoint: { x: 2, y: 3 } },
      { aPoint: { x: 2, y: 2 }, bPoint: { x: 4, y: 6 } },
    ];

    let new_aPoint: Point = { x: 2, y: 2 };
    let result = convertCoordinates(referencePins, new_aPoint);
    expect(result.x).toBeCloseTo(4, 2);
    expect(result.y).toBeCloseTo(6, 2);
  });

  // real coordinates
  // test("converts real coordinates", () => {
  //   const A_C1: Point = { x: -492.5, y: -797.5 };
  //   const A_C2: Point = { x: -72.658888983, y: 41.333340991 };
  //   const B_C1: Point = { x: -413.79196278370205, y: -713.2956400404881 };
  //   const B_C2: Point = { x: -72.65872243798586, y: 41.333434986920594 };

  //   let new_C1: Point = { x: 0, y: 0 };
  //   let new_C2 = convertCoordinates(A_C1, A_C2, B_C1, B_C2, new_C1);
  //   expect(new_C2.x).toBeCloseTo(-72.6965, 4);
  //   expect(new_C2.y).toBeCloseTo(41.3545, 4);
  // });
});
