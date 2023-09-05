import React, { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Pin } from "@/types/Vector";
import styles from "@/components/Map.module.css";

// INPUT
//  - MapURL
//  - Pins
//  - UserPath

type Props = {
  start: Pin;
  end: Pin;
};

const MAP_URL = "/images/trailmap-timberlands-precise-1.jpeg";

interface PinMarkerProps {
  pin: Pin;
}

export function InterpolateMap(props: Props) {
  const { start, end } = props;
  const mapReference = useRef(null);

  const PinComponent: React.FC<PinMarkerProps> = (props) => {
    const { pin } = props;
    const left = pin.mapPoint.x;
    const top = -1 * pin.mapPoint.y;

    return (
      <img
        src="/map-x.svg"
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
            <PinComponent pin={start} />
            <PinComponent pin={end} />
            <img src={MAP_URL} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
