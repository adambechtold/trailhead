import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import MapStateTracker from './map-state-tracker';
import styles from '@/components/map.module.css';

const mapFilePath = '/images/trail-map-smaller.jpeg';



function getWidthRatio(mapWidth, viewportWidth) {
  return viewportWidth / mapWidth;
}

export default function Map({ mapPosition, setMapPosition, pins }) {  

  // get the current centerpoint of the map
  // Example State
  // {
  //   positionX: 0,
  //   positionY: 0,
  //   scale: 1,
  //   previousScale: 1,
  //}
  const [currentMapState, setCurrentMapState] = useState({});
  const mapReference = useRef(null);

  const handleMapStateUpdate = (state) => {
    setCurrentMapState(state); // state from the transform component
    const { positionX, positionY, scale } = state;

    // get the position of the map
    const mapNode = ReactDOM.findDOMNode(mapReference.current);
    const mapRect = mapNode.getBoundingClientRect();

    setMapPosition({
      x: mapRect.left,
      y: mapRect.top,
      scale
    });
  };


  const showPin = (pin) => {
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
  }


  return (
    <TransformWrapper
      limitToBounds={false}
      initialScale={mapPosition.scale}
      minScale={0.3} // TODO: Calculate from image size
      maxScale={20}  // TODO: Calculate from image size
    >
      {({ zoomIn, zoomOut, setTransform, ...rest }) => (
        <>
          <button onClick={() => setTransform(
            -252,
            -543,
            1
          )}
            style={{ position: 'fixed', top: '100px', left: '100px', zIndex: '1000' }}
          >Go To Point</button>
          <button onClick={() => setTransform(
            0,
            0,
            1
          )}
            style={{ position: 'fixed', top: '80px', left: '100px', zIndex: '1000' }}
          >Go To Scale 1, position (0,0)</button>
          <button onClick={() => setTransform(
            0,
            0,
            2
          )}
            style={{ position: 'fixed', top: '120px', left: '100px', zIndex: '1000' }}
          >Go To Scale 2, position (0,0)</button>
          <button onClick={() => setTransform(
            0,
            0,
            3
          )}
            style={{ position: 'fixed', top: '140px', left: '100px', zIndex: '1000' }}
          >Go To Scale 3, position (0,0)</button>
          <TransformComponent>
            <MapStateTracker
              setCurrentMapState={handleMapStateUpdate}
            />
            {pins && pins.map((pin, index) => showPin(pin))}
            <img src={mapFilePath} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  )
}