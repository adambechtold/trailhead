// Let's test the ability to interpolate the position of the user
// without using leaflet and using the convertCoordinates function

// the entire page is a map that we can pinch and zoom and drag
// we can add x markers for pins and a path of the user

import dynamic from "next/dynamic";
import { InterpolateMap } from "@/components/InterpolateMap";
import { Pin, Coordinates } from "@/types/Vector";
import { configurations } from "./overlay.configurations";
import { useEffect, useState } from "react";

const InterpolateMapDynamic = dynamic(() => Promise.resolve(InterpolateMap), {
  ssr: false,
});

export default function ExploreInterpolatePosition() {
  const configuration = configurations[0];
  const start: Pin = configuration.start;
  const end: Pin = configuration.end;

  const [percentMovementLongitude, setPercentMovementLongitude] = useState(50);
  const [percentMovementLatitude, setPercentMovementLatitude] = useState(50);
  const [isIncrementing, setIsIncrementing] = useState(true);

  // this isn't working, but that's fine
  function updateMovement() {
    console.log(percentMovementLatitude, { isIncrementing });
    if (percentMovementLatitude > 99 && isIncrementing) {
      setIsIncrementing((prev) => !prev);
    } else if (percentMovementLatitude < 1 && !isIncrementing) {
      setIsIncrementing((prev) => !prev);
    }

    setPercentMovementLongitude((prev) => {
      return isIncrementing ? prev + 1 : prev - 1;
    });
    setPercentMovementLatitude((prev) => {
      return isIncrementing ? prev + 1 : prev - 1;
    });
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      updateMovement();
    }, 100);

    return () => clearInterval(intervalID);
  }, [isIncrementing]);

  const differenceLongitude =
    end.location.coordinates.longitude - start.location.coordinates.longitude;
  const differenceLatitude =
    end.location.coordinates.latitude - start.location.coordinates.latitude;
  const movementLongitude =
    differenceLongitude * (percentMovementLongitude / 100);
  const movementLatitude = differenceLatitude * (percentMovementLatitude / 100);

  const currentUserLocation = {
    longitude: start.location.coordinates.longitude + movementLongitude,
    latitude: start.location.coordinates.latitude + movementLatitude,
  };

  return (
    <div>
      <InterpolateMap
        start={start}
        end={end}
        userLocation={currentUserLocation}
      />
    </div>
  );
}
