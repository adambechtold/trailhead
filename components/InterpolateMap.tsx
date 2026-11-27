import React, { useEffect, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import MapStateTracker from "@/components/MapStateTracker"; // consider moving this into InterpolateMap or CurrentMap and passsing it into InterpolateMap

import { Location, Pin, Point } from "@/types/Vector";
import { MapPosition } from "@/types/MapPosition";
import { getUserPin } from "@/utils/vector";

import styles from "@/components/InterpolateMap.module.css";

type Props = {
  pins?: Pin[];
  userLocation?: Location;
  userHeading?: number;
  mapURL: string;
  initialScale?: number;
  onMapStateUpdate?: (mapPosition: MapPosition) => void;
  pinSize?: number;
  hideConfigurationPins?: boolean;
  children?: React.ReactNode;
};

export default function InterpolateMap(props: Props) {
  const {
    pins,
    userLocation,
    userHeading,
    mapURL,
    initialScale,
    onMapStateUpdate,
    pinSize = 50,
    hideConfigurationPins = false,
    children,
  } = props;
  const mapReference = useRef<HTMLImageElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  // TODO: Learn how to read scale off of the transform component. We shouldn't be tracking it manually.
  const [mapScale, setMapScale] = useState(initialScale || 0.4);
  const canFindUserLocation = !!pins && pins.length >= 2 && !!userLocation;
  const [hasUserLocation, setHasUserLocation] = useState(canFindUserLocation);
  const userPin: Pin | undefined = canFindUserLocation
    ? getUserPin(pins, userLocation)
    : undefined;

  const handleMapStateUpdate = ({ scale }: { scale: number }) => {
    // every time to map updates, let's track that.
    // This is useful when we need to create pins
    setMapScale(scale);
    if (!mapReference.current) return;

    const mapRect = mapReference.current.getBoundingClientRect();

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

  const zoomToFit = () => {
    if (!mapReference.current) return;
    const { x, y, scale } = calculateZoomToFitTransform(mapReference);
    transformComponentRef.current?.setTransform(x, y, scale);
  };

  const zoomToUser = () => {
    // TODO: Calculate the scale based on the "height" you want to view the user from: i.e. use the real area in view
    let scale = mapScale;

    // 3x the zoom of the map unless the map is already zoomed in more than that
    const { scale: fitScale } = calculateZoomToFitTransform(mapReference);
    const zoomedScale = fitScale * 3;
    if (zoomedScale > mapScale) scale = zoomedScale;

    if (userPin) {
      zoomToPoint(userPin?.mapPoint, scale); // Zoom to the user with the current map scale
    }
  };

  const zoomToPoint = (point: Point, scale: number) => {
    if (!transformComponentRef.current) return;

    const { x, y } = point;
    const left = x;
    const top = -y;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const offsetX = windowWidth / 2 - left * scale;
    const offsetY = windowHeight / 2 - top * scale;

    setMapPosition(offsetX, offsetY, scale);
  };

  function setMapPosition(offsetX: number, offsetY: number, scale: number = 1) {
    transformComponentRef.current?.setTransform(offsetX, offsetY, scale);
  }

  // the first time we acquire the user location, zoom to it
  useEffect(() => {
    if (!hasUserLocation && userPin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time flag, set when the first location arrives
      setHasUserLocation(true);
      if (isPointWithinMap(userPin.mapPoint, mapReference)) zoomToUser();
      // if the user is not within the map, don't zoom to them on load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to new locations
  }, [userLocation]);

  useEffect(() => {
    if (mapReference.current) {
      zoomToFit();
    }
  }, [mapURL]);

  function calculatePinScale(targetSize: number): number {
    const defaultPinSize = 24; // px
    let pinScale = targetSize / (defaultPinSize * mapScale);
    return pinScale;
  }

  return (
    <TransformWrapper
      limitToBounds={false}
      initialScale={mapScale}
      minScale={0.1}
      maxScale={20}
      ref={transformComponentRef}
    >
      {() => (
        <>
          {React.Children.map(children, (child) => {
            if (!child) return;
            return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
              zoomToFit,
              zoomToImage,
              resetImage,
              zoomToUser,
              mapReference,
            });
          })}
          <TransformComponent>
            <MapStateTracker setCurrentMapState={handleMapStateUpdate} />
            {pins &&
              !hideConfigurationPins &&
              pins.map((pin, index) => (
                <div key={`pin-${index}`}>
                  <PinComponent
                    pin={pin}
                    type={"PIN"}
                    scale={calculatePinScale(pinSize)}
                  />
                </div>
              ))}
            {userPin && (
              <PinComponent
                pin={userPin}
                type={userHeading ? "USER_WITH_DIRECTION" : "USER_NO_DIRECTION"}
                heading={userHeading}
                scale={calculatePinScale(pinSize)}
              />
            )}
            <img src={mapURL} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}

interface PinMarkerProps {
  pin: Pin;
  type: "USER_NO_DIRECTION" | "USER_WITH_DIRECTION" | "PIN";
  heading?: number;
  scale?: number;
}

const typeToStyle = {
  USER_NO_DIRECTION: "/icons/user-location.svg",
  USER_WITH_DIRECTION: "/icons/user-location-with-direction.svg",
  PIN: "/icons/map-x.svg",
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

/**
 * Calculates the transform needed to fit the map image within the window.
 *
 * @param {React.RefObject<HTMLImageElement | null>} mapReference - The reference to the map image element.
 * @returns {{ x: number, y: number, scale: number }} - The transform object containing the x and y offsets and the scale factor.
 */
const calculateZoomToFitTransform = (
  mapReference: React.RefObject<HTMLImageElement | null>
) => {
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

function isPointWithinMap(
  point: Point,
  mapReference: React.RefObject<HTMLImageElement | null>
) {
  const top = -point.y;
  const left = point.x;
  const imageWidth = mapReference.current?.width;
  const imageHeight = mapReference.current?.height;

  if (!(imageWidth && imageHeight)) return false;

  return top >= 0 && top <= imageHeight && left >= 0 && left <= imageWidth;
}
