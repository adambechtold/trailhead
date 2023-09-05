// Let's test the ability to interpolate the position of the user
// without using leaflet and using the convertCoordinates function

// the entire page is a map that we can pinch and zoom and drag
// we can add x markers for pins and a path of the user

import dynamic from "next/dynamic";
import { InterpolateMap } from "@/components/InterpolateMap";
import { Pin } from "@/types/Vector";
import { configurations } from "./overlay.configurations";

const InterpolateMapDynamic = dynamic(() => Promise.resolve(InterpolateMap), {
  ssr: false,
});

export default function ExploreInterpolatePosition() {
  const start: Pin = configurations[0].start;
  const end: Pin = configurations[0].end;

  return (
    <div>
      <InterpolateMap start={start} end={end} />
    </div>
  );
}
