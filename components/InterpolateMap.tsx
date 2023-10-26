import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  TransformComponent,
  TransformWrapper,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import MapStateTracker from "@/components/MapStateTracker"; // consider moving this into InterpolateMap or CurrentMap and passsing it into InterpolateMap

import { Pin, Location, Point } from "@/types/Vector";
import { getUserPin } from "@/utils/vector";
import { MapPosition } from "@/types/MapPosition";

import styles from "@/components/InterpolateMap.module.css";

type Props = {
  start?: Pin;
  end?: Pin;
  userLocation?: Location;
  userHeading?: number;
  mapURL: string;
  initialScale?: number;
  onMapStateUpdate?: (mapPosition: MapPosition) => void;
  pinScale?: number;
  hideConfigurationPins?: boolean;
  children?: React.ReactNode;
};

export default function InterpolateMap(props: Props) {
  const {
    start,
    end,
    userLocation,
    userHeading,
    mapURL,
    initialScale,
    onMapStateUpdate,
    pinScale,
    hideConfigurationPins = false,
    children,
  } = props;
  const mapReference = useRef<HTMLImageElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  // TODO: Learn how to read scale off of the transform component. We shouldn't be tracking it manually.
  const [mapScale, setMapScale] = useState(initialScale || 0.4);

  const canFindUserLocation = !!start && !!end && !!userLocation;
  const userPin: Pin | undefined = canFindUserLocation
    ? getUserPin(start, end, userLocation)
    : undefined;

  const handleMapStateUpdate = ({ scale }: { scale: number }) => {
    // every time to map updates, let's track that.
    // This is useful when we need to create pins
    setMapScale(scale);
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

  const zoomToUser = () => {
    const targetPinSize = 50; // px
    const defaultPinSize = 24; // px // TODO: Either share this in a higher level component or implement fixed-pin-size
    const currentPinSize = defaultPinSize * (pinScale || 1); // px
    const targetScale = targetPinSize / currentPinSize;

    if (userPin) {
      zoomToPoint(userPin?.mapPoint, targetScale); // Zoom to the user with the current map scale
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

  useEffect(() => {
    if (mapReference.current) {
      zoomToFit();
    }
  }, [mapURL]);

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
            return React.cloneElement(child as React.ReactElement, {
              zoomToFit,
              zoomToImage,
              resetImage,
              zoomToUser,
              mapReference,
            });
          })}
          <TransformComponent>
            <MapStateTracker setCurrentMapState={handleMapStateUpdate} />
            {start && !hideConfigurationPins && (
              <PinComponent pin={start} type={"PIN"} scale={pinScale} />
            )}
            {end && !hideConfigurationPins && (
              <PinComponent pin={end} type={"PIN"} scale={pinScale} />
            )}
            {userPin && (
              <PinComponent
                pin={userPin}
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
