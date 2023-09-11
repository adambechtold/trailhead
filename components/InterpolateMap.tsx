import React, { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Pin, Coordinates } from "@/types/Vector";
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

interface PinMarkerProps {
  pin: Pin;
  type: "USER" | "PIN";
}

export function InterpolateMap(props: Props) {
  const { start, end, userLocation } = props;
  const mapReference = useRef(null);

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
            <img src={MAP_URL} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
