import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

import MapStateTracker from './MapStateTracker.js';
import styles from '@/components/LeafletMap.module.css';

export default function InterpolatedMap({
  imageUrl,
  pins,
}) {

  // get the current centerpoint of the map
  // Example State
  // {
  //   positionX: 0,
  //   positionY: 0,
  //   scale: 1,
  //   previousScale: 1,
  //}

  const placePin = (pin) => {
    return (
      <img
        src='map-x.svg'
        alt='Map Pin'
        className={styles.mapPin}
        style={{
          top: pin.top,
          left: pin.left
        }}
        key={`pin-${pin.index}}`}
      />
    )
  };

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <button onClick={() => zoomIn()}>Zoom In</button>
        <button onClick={() => zoomOut()}>Zoom Out</button>
        <button onClick={() => resetTransform()}>Reset</button>
      </>
    );
  };

  return (
    <>
      <TransformWrapper
        initialScale={1}
        limitToBounds={false}
        styles={styles.wrapper}
      >
        <TransformComponent>
          <div className={styles.mapContent}>
            Adamadsfadsfas
            <img
              src={imageUrl}
              alt="Trail Map"
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </>
  )
}