import { Point, Vector } from "@/types/Vector";

// =============== FROM utils/vector.ts =================
function getC2Vector(length: number, angleDegrees: number): Vector {
  if (angleDegrees > 0 && angleDegrees <= 90) {
    return new Vector(
      length * Math.cos((angleDegrees * Math.PI) / 180),
      length * Math.sin((angleDegrees * Math.PI) / 180)
    );
  } else if (angleDegrees > 90 && angleDegrees <= 180) {
    return new Vector(
      -length * Math.cos(((180 - angleDegrees) * Math.PI) / 180),
      length * Math.sin(((180 - angleDegrees) * Math.PI) / 180)
    );
  } else if (angleDegrees > 180 && angleDegrees <= 270) {
    return new Vector(
      -length * Math.sin(((angleDegrees - 180) * Math.PI) / 180),
      -length * Math.cos(((angleDegrees - 180) * Math.PI) / 180)
    );
  } else {
    return new Vector(
      length * Math.sin(((360 - angleDegrees) * Math.PI) / 180),
      -length * Math.cos(((360 - angleDegrees) * Math.PI) / 180)
    );
  }
}

export function convertCoordinates2( //this doesn't seem to work :/
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

  const vector_AtoNew_C2 = getC2Vector(
    length_AtoNew_C2,
    vector_AtoNew_C1.angleDegrees
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

// =============== Original from index.js =================
// returns Top and Left of the User
type ConvertArgs = {
  pins: any;
  latitude: any;
  longitude: any;
};

function convertUserLocationToMapPosition({
  pins,
  latitude,
  longitude,
}: ConvertArgs) {
  if (pins.length < 2) {
    const empty = () => ({ top: null, left: null });
    return empty();
  }

  // TODO: Use more than 2 pins
  const pin1 = pins[0];
  const pin2 = pins[1];

  if (pin1.latitude === pin2.latitude || pin1.longitude === pin2.longitude) {
    console.log("reset and move");
    /* 
    addDebugStatement(
      "lat and long are the same; reset and move; for now, adjusting so you can see something"
    );
    */
    // for debugging
    pin1.latitude = pin2.latitude + 0.000002;
    pin1.longitude = pin2.longitude + 0.000002;
    // return empty();
  }

  const offsetX =
    (-1 * (pin1.left * pin2.latitude - pin2.left * pin1.latitude)) /
    (pin1.latitude - pin2.latitude);
  const offsetY =
    (-1 * (pin1.top * pin2.longitude - pin2.top * pin1.longitude)) /
    (pin1.longitude - pin2.longitude);

  const scalerX = (pin1.left - offsetX) / pin1.latitude;
  const scalerY = (pin1.top - offsetY) / pin1.longitude;

  // setMapFunctionParameters({ offsetX, offsetY, scalerX, scalerY });

  if (isNaN(offsetX) || isNaN(offsetY) || isNaN(scalerX) || isNaN(scalerY)) {
    console.log("offset or scaler is NaN");
    // TMP: addDebugStatement("offset or scaler is NaN");
    // TMP: return empty();
  }

  if (offsetX === 0 || offsetY === 0 || scalerX === 0 || scalerY === 0) {
    console.log("offset or scaler is 0");
    // TMP: addDebugStatement("offset or scaler is 0");
    // TMP: return empty();
  }

  if (
    offsetX === Infinity ||
    offsetY === Infinity ||
    scalerX === Infinity ||
    scalerY === Infinity
  ) {
    console.log("offset or scaler is Infinity");
    // TMP: addDebugStatement("offset or scaler is Infinity");
    // TMP: return empty();
  }

  console.log("offsetX", offsetX, "scaleX", scalerX);
  console.log("offsetY", offsetY, "scaleY", scalerY);

  const x = latitude * scalerX + offsetX;
  const y = longitude * scalerY + offsetY;

  return { left: x, top: y };
}
