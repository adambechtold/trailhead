import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  TransformComponent,
  TransformWrapper,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import MapStateTracker from "@/components/MapStateTracker"; // consider moving this into InterpolateMap or CurrentMap and passsing it into InterpolateMap

import { Pin, Location, Point } from "@/types/Vector";
import { convertCoordinates } from "@/utils/vector";
import { MapPosition } from "@/types/MapPosition";

import styles from "@/components/InterpolateMap.module.css";

type Props = {
  start?: Pin;
  end?: Pin;
  userLocation?: Location;
  userHeading?: number;
  mapURL: string;
  scale?: number; // TODO: why do we pass in scale? It's constantly changing and only used to set initial scale
  onMapStateUpdate?: (mapPosition: MapPosition) => void;
  pinScale?: number;
  children?: React.ReactNode;
};

export default function InterpolateMap(props: Props) {
  // TODO: Make this a default export and update import statements
  const {
    start,
    end,
    userLocation,
    userHeading,
    mapURL,
    scale,
    onMapStateUpdate,
    pinScale,
    children,
  } = props;
  const mapReference = useRef<HTMLImageElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const canFindUserLocation = !!start && !!end && !!userLocation;

  const handleMapStateUpdate = ({ scale }: { scale: number }) => {
    // every time to map updates, let's track that.
    // This is useful when we need to create pins
    if (!mapReference.current) return;

    const mapNode = ReactDOM.findDOMNode(mapReference.current);

    if (!mapNode || !(mapNode instanceof HTMLElement)) return;
    const mapRect = mapNode.getBoundingClientRect();

    if (onMapStateUpdate) {
      onMapStateUpdate({
        scale,
        x: mapRect.left,
        y: mapRect.top,
      });
    }
  };

  const zoomToImage = () => {
    if (transformComponentRef.current && mapReference.current) {
      const ref = transformComponentRef.current;
      const { zoomToElement } = ref;
      zoomToElement(mapReference.current);
    }
  };

  const resetImage = () => {
    if (transformComponentRef.current) {
      const ref = transformComponentRef.current;
      const { resetTransform } = ref;
      resetTransform();
    }
  };

  const calculateZoomToFitTransform = () => {
    const imageWidth = mapReference.current?.width;
    const imageHeight = mapReference.current?.height;
    const windowWidth = window?.innerWidth;
    const windowHeight = window?.innerHeight;

    if (!(imageWidth && imageHeight && windowWidth && windowHeight)) {
      return {
        x: 0,
        y: 0,
        scale: 0.4,
      };
    }

    const windowAspectRatio = windowWidth / windowHeight;
    const imageAspectRatio = imageWidth / imageHeight;

    if (windowAspectRatio < imageAspectRatio) {
      const scale = windowWidth / imageWidth;
      return {
        x: 0,
        y: (windowHeight - imageHeight * scale) / 2,
        scale,
      };
    } else {
      const scale = windowHeight / imageHeight;
      return {
        x: (windowWidth - imageWidth * scale) / 2,
        y: 0,
        scale,
      };
    }
  };

  const zoomToFit = () => {
    const { x, y, scale } = calculateZoomToFitTransform();
    transformComponentRef.current?.setTransform(x, y, scale);
  };

  useEffect(() => {
    if (mapReference.current) {
      zoomToFit();
    }
  }, [mapURL]);

  return (
    <TransformWrapper
      limitToBounds={false}
      initialScale={scale || 0.4}
      minScale={0.1}
      maxScale={20}
      ref={transformComponentRef}
    >
      {() => (
        <>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement, {
              zoomToFit,
              zoomToImage,
              resetImage,
              mapReference,
            });
          })}
          <TransformComponent>
            <MapStateTracker setCurrentMapState={handleMapStateUpdate} />
            {start && (
              <PinComponent pin={start} type={"PIN"} scale={pinScale} />
            )}
            {end && <PinComponent pin={end} type={"PIN"} scale={pinScale} />}
            {canFindUserLocation && (
              <PinComponent
                pin={getUserPin(start, end, userLocation)}
                type={userHeading ? "USER_WITH_DIRECTION" : "USER_NO_DIRECTION"}
                heading={userHeading}
                scale={pinScale}
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
  type: "USER_NO_DIRECTION" | "USER_WITH_DIRECTION" | "PIN";
  heading?: number;
  scale?: number;
}

const typeToStyle = {
  USER_NO_DIRECTION: "/user-location.svg",
  USER_WITH_DIRECTION: "/user-location-with-direction.svg",
  PIN: "/map-x.svg",
};

const PinComponent: React.FC<PinMarkerProps> = (props) => {
  const { pin, type, heading, scale } = props;
  const left = pin.mapPoint.x;
  const top = -1 * pin.mapPoint.y;
  const imgURL = typeToStyle[type];

  let style: any = {
    top,
    left,
  };
  if (heading)
    style["transform"] = `translate(-50%, -50%) rotate(${heading}deg)`;

  style.width = scale ? `${scale * 24}px` : "24px";
  style.height = scale ? `${scale * 24}px` : "24px";

  return (
    <img src={imgURL} alt="Pin" className={styles["map-pin"]} style={style} />
  );
};
