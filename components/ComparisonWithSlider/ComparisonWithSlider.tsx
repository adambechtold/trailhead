import React, { useState, useRef, useEffect } from "react";

import Handle from "./Handle/Handle";

import styles from "./ComparisonWithSlider.module.css";

interface Props {
  beforeImageURL: string;
  afterImageURL: string;
}

export default function ComparisonWithSlider({
  beforeImageURL,
  afterImageURL,
}: Props) {
  const [percentBefore, setPercentBefore] = useState(50);
  const [isDragStarted, setIsDragStarted] = useState(false);
  const [sizeBefore, setSizeBefore] = useState<number | null>(null);

  const dragElementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragStarted(true);
  };

  const onDragStop = () => {
    setIsDragStarted(false);
  };

  useEffect(() => {
    setToPosition(percentBefore);
  }, []);

  const containerOnTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    e.preventDefault();
    if (!e.touches[0].pageX) {
      return;
    }

    moveToPosition(e.touches[0].pageX);
  };

  const containerOnMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!isDragStarted || !e.pageX) {
      return;
    }

    moveToPosition(e.pageX);
  };

  const moveToPosition = (xPosition: number) => {
    const { handleWidth, containerOffsetLeft, containerWidth } =
      getElementSizes();
    const xPositionOnPage = xPosition;
    const xPositionWithinContainer =
      xPositionOnPage - containerOffsetLeft - handleWidth;

    if (xPositionWithinContainer < 0) {
      return;
    } else if (xPositionWithinContainer > containerWidth) {
      return;
    }

    setPercentBefore((xPositionWithinContainer / containerWidth) * 100);
    setToPosition((xPositionWithinContainer / containerWidth) * 100);
  };

  const setToPosition = (percentBefore: number) => {
    if (!containerRef.current) {
      return;
    }
    if (percentBefore > 100 || percentBefore < 0) {
      return;
    }

    let resizableImageWidth =
      (percentBefore * containerRef.current.offsetWidth) / 100;

    setSizeBefore(resizableImageWidth);
  };

  const getElementSizes = () => {
    const handleWidth = dragElementRef.current?.offsetWidth || 0;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const containerOffsetLeft = containerRef.current?.offsetLeft || 0;
    const minLeft = containerOffsetLeft + 10; // TODO: why is this 10?
    const maxLeft = containerOffsetLeft + containerWidth - handleWidth - 10; // TODO: why is this 10?

    return {
      handleWidth,
      containerWidth,
      containerOffsetLeft,
      minLeft,
      maxLeft,
    };
  };

  return (
    <figure
      ref={containerRef}
      onClick={onDragStop}
      className={styles.container}
      onMouseMove={containerOnMouseMove}
      onTouchMove={containerOnTouchMove}
    >
      <div className={styles["original-image-container"]}>
        <img
          src={beforeImageURL}
          alt="Before"
          className={styles["original-image"]}
        />
        {percentBefore > 29 && (
          <span
            className={[styles["title-text"], styles["bottom-left"]].join(" ")}
          >
            AllTrails
          </span>
        )}
      </div>

      <div
        className={styles["compared-image-container"]}
        style={{ clipPath: `inset(0 0 0 ${percentBefore}%)` }}
      >
        <img src={afterImageURL} alt="After" />
        {percentBefore < 63 && (
          <span
            className={[styles["title-text"], styles["bottom-right"]].join(" ")}
          >
            Kiosk Map
          </span>
        )}
      </div>

      <Handle
        isDragStarted={isDragStarted}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        positionLeft={sizeBefore || 0}
        elementRef={dragElementRef}
      />
    </figure>
  );
}
