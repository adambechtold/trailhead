import React, { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Pin, Coordinates, Point } from "@/types/Vector";
import { convertCoordinates } from "@/utils/vector";
import styles from "@/components/Map.module.css";

// INPUT
//  - MapURL
//  - Pins
//  - UserPath

type Props = {
  start: Pin;
  end: Pin;
  userLocation?: Coordinates;
};

const MAP_URL = "/images/trailmap-timberlands-precise-1.jpeg";

export function InterpolateMap(props: Props) {
  const { start, end, userLocation } = props;
  const mapReference = useRef(null);

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
            <PinComponent pin={start} type={"PIN"} />
            <PinComponent pin={end} type={"PIN"} />
            {userLocation && (
              <PinComponent
                pin={getUserPin(start, end, userLocation)}
                type={"USER"}
              />
            )}
            <img src={MAP_URL} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}

function getUserPin(start: Pin, end: Pin, userLocation: Coordinates) {
  const startCoordinatesPoint: Point = {
    x: start.location.coordinates.longitude,
    y: start.location.coordinates.latitude,
  };
  const endCoordinatesPoint: Point = {
    x: end.location.coordinates.longitude,
    y: end.location.coordinates.latitude,
  };
  const userLocationCoordinatesPoint: Point = {
    x: userLocation.longitude,
    y: userLocation.latitude,
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
      longitude: userLocation.longitude,
      latitude: userLocation.latitude,
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
