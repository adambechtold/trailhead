// Let's test the ability to interpolate the position of the user
// without using leaflet and using the convertCoordinates function

// the entire page is a map that we can pinch and zoom and drag
// we can add x markers for pins and a path of the user

import InterpolateMap from "@/components/InterpolateMap";
import { Pin } from "@/types/Vector";
import { configurations } from "../../types/overlay.configurations";
import { useEffect, useState } from "react";
import MapControls from "@/components/MapControls";

export default function ExploreInterpolatePosition() {
  const configuration = configurations[0];
  const start: Pin = configuration.start;
  const end: Pin = configuration.end;

  const [percentMovementLongitude, setPercentMovementLongitude] = useState(50);
  const [percentMovementLatitude, setPercentMovementLatitude] = useState(50);
  const [isIncrementing, setIsIncrementing] = useState(true);
  const [heading, setHeading] = useState(0);
  const [pinScale, setPinScale] = useState(1);

  // this isn't working, but that's fine
  function updateMovement() {
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

    setHeading((prev) => {
      return prev + 5 > 360 ? 0 : prev + 5;
    });

    setPinScale((prev) => {
      return prev + 0.01 > 3 ? 1 : prev + 0.1;
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
    coordinates: {
      longitude: start.location.coordinates.longitude + movementLongitude,
      latitude: start.location.coordinates.latitude + movementLatitude,
    },
  };

  const MAP_URL = "/images/trailmap-timberlands-precise-1.jpeg";

  return (
    <InterpolateMap
      start={start}
      end={end}
      userLocation={currentUserLocation}
      userHeading={heading}
      mapURL={MAP_URL}
      pinScale={pinScale}
    >
      <MapControls />
    </InterpolateMap>
  );
}
