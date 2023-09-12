import React, { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Pin, Location, Point } from "@/types/Vector";
import { convertCoordinates } from "@/utils/vector";
import styles from "@/components/Map.module.css";

// INPUT
//  - MapURL
//  - Pins
//  - UserPath

type Props = {
  start?: Pin;
  end?: Pin;
  userLocation?: Location;
  mapURL: string;
};

export function InterpolateMap(props: Props) {
  const { start, end, userLocation, mapURL } = props;
  const mapReference = useRef(null);

  const canFindUserLocation = !!start && !!end && !!userLocation;

  return (
    <TransformWrapper
      limitToBounds={false}
      initialScale={0.4}
      minScale={0.3}
      maxScale={20}
    >
      {() => (
        <>
          <TransformComponent>
            {start && <PinComponent pin={start} type={"PIN"} />}
            {end && <PinComponent pin={end} type={"PIN"} />}
            {canFindUserLocation && (
              <PinComponent
                pin={getUserPin(start, end, userLocation)}
                type={"USER"}
              />
            )}
            <img src={mapURL} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}

function getUserPin(start: Pin, end: Pin, userLocation: Location) {
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

interface PinMarkerProps {
  pin: Pin;
  type: "USER" | "PIN";
}

const PinComponent: React.FC<PinMarkerProps> = (props) => {
  const { pin, type } = props;
  const left = pin.mapPoint.x;
  const top = -1 * pin.mapPoint.y;
  const imgURL = type === "USER" ? "/user-location.svg" : "/map-x.svg";

  return (
    <img
      src={imgURL}
      alt="Pin"
      className={styles.mapPin}
      style={{
        left,
        top,
      }}
    />
  );
};
