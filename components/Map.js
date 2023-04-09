import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import MapStateTracker from './MapStateTracker.js';
import styles from '@/components/Map.module.css';



function getWidthRatio(mapWidth, viewportWidth) {
  return viewportWidth / mapWidth;
}

export default function Map({ mapFile, pins, userLocation, mapPosition, setMapPosition }) {  

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
  };

  const showUserLocation = (location) => {
    return (
      <img 
        src='user-location.svg'
        alt='User Location'
        className={styles.mapPin}
        style={{
          top: location.top,
          left: location.left
        }}
        key={`user-location`}
      />
    );
  };

  return (
    <TransformWrapper
      limitToBounds={false}
      initialScale={mapPosition.scale}
      minScale={0.3} // TODO: Calculate from image size
      maxScale={20}  // TODO: Calculate from image size
    >
      {({ zoomIn, zoomOut, setTransform, ...rest }) => (
        <>
          <TransformComponent>
            <MapStateTracker
              setCurrentMapState={handleMapStateUpdate}
            />
            {pins && pins.map(showPin)}
            {userLocation && showUserLocation(userLocation)}
            <img src={mapFile} alt="Trail Map" ref={mapReference} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  )
}