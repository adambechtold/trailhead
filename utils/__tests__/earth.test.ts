import { Coordinates } from "@/types/Vector";
import { calculateDistance } from "../earth";

const expectResultWithin = (
  result: number,
  expected: number,
  acceptableError: number
) => {
  const diff = Math.abs(result - expected);
  expect(diff).toBeLessThan(acceptableError);
};

describe("calculateDistance", () => {
  test("the same points are 0 meters apart", () => {
    let A: Coordinates = { latitude: 0, longitude: 0 };
    let B: Coordinates = { latitude: 0, longitude: 0 };
    let result = calculateDistance(A, B);
    expect(result).toBeCloseTo(0, 2);

    A = { latitude: 41, longitude: -72 };
    B = { latitude: 41, longitude: -72 };
    result = calculateDistance(A, B);
    expect(result).toBeCloseTo(0, 2);
  });

  test("a football field is about 91.44 meters long", () => {
    // Clemson Football https://maps.app.goo.gl/V3fL1hnoNKYwtN8p7
    let A: Coordinates = {
      latitude: 34.67864819392677,
      longitude: -82.84369141253251,
    };
    let B: Coordinates = {
      latitude: 34.678850018068566,
      longitude: -82.84272112347153,
    };
    let result = calculateDistance(A, B);
    expectResultWithin(result, 91.44, 1);

    // Football Field in Seattle, WA https://maps.app.goo.gl/UhstEcWVQCJJc6JZ8
    A = { latitude: 47.70782873919371, longitude: -122.2927693764612 };
    B = { latitude: 47.707820701191515, longitude: -122.29154948211453 };
    result = calculateDistance(A, B);
    expectResultWithin(result, 91.44, 1);
  });

  test("measurement of a trail area is accurate", () => {
    let A: Coordinates = {
      latitude: 41.33211307956967,
      longitude: -72.68490849619246,
    };
    let B: Coordinates = {
      latitude: 41.34707779417844,
      longitude: -72.6740226406373,
    };
    expectResultWithin(calculateDistance(A, B), 1.89 * 1000, 100);
  });

  test("measurement across very large distances is correct", () => {
    let A: Coordinates = {
      latitude: 48.15447653032159,
      longitude: -122.67823855879563,
    };
    let B: Coordinates = {
      latitude: -43.24220596918649,
      longitude: 147.79967082606433,
    };
    expectResultWithin(calculateDistance(A, B), 13_389 * 1000, 1000);
  });
});
