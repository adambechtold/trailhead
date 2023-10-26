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

    const { handleWidth } = getElementSizes();
    const position = e.touches[0].pageX + handleWidth / 2;
    moveToPosition(position);
  };

  const containerOnMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!isDragStarted || !e.pageX) {
      return;
    }

    const position = e.pageX;
    moveToPosition(position);
  };

  const moveToPosition = (xPosition: number) => {
    const { containerWidth, containerX } = getElementSizes();
    const xPositionOnPage = xPosition;
    const xPositionWithinContainer = xPositionOnPage - containerX;

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
    const containerX = getElementXPosition(containerRef.current as HTMLElement);

    return {
      handleWidth,
      containerWidth,
      containerX,
    };
  };

  const getElementXPosition = (element: HTMLElement): number => {
    let x = element.offsetLeft;
    let parent = element.offsetParent as HTMLElement;
    while (parent != null) {
      x += parent.offsetLeft;
      parent = parent.offsetParent as HTMLElement;
    }
    return x;
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
        {percentBefore < 53 && (
          <span
            className={[styles["title-text"], styles["bottom-right"]].join(" ")}
          >
            Trailhead Map
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
