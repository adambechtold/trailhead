import { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

// INPUT
//  - MapURL
//  - Pins
//  - UserPath

type Props = {};

const MAP_URL = "/images/trailmap-timberlands-precise-1.jpeg";

export function InterpolateMap(props: Props) {
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
            <img src={MAP_URL} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
