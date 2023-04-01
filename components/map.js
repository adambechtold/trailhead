import { useState } from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import MapStateTracker from './map-state-tracker';
import styles from '@/components/map.module.css';

const mapFilePath = '/images/trail-map-smaller.jpeg';

function getMapImageDimensions(mapFilePath) {
  const map = new Image();
  map.src = mapFilePath;
  const { width, height } = map;
  return { width, height };
}

function getViewportDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function getWidthRatio(mapWidth, viewportWidth) {
  return viewportWidth / mapWidth;
}

export default function Map({ firstPinCorrdinates }) {

  // TODO: Use this to set the initial scale
  // I'm not sure why, but something breaks when I try to use it
  // I can get the ratio, but if I use it to set the initial scale, the map doesn't render correctly
  // To replicate, uncomment the initialScale prop in the TransformWrapper component below
  const {
    width: mapWidth
  } = getMapImageDimensions(mapFilePath);

  const {
    width: viewportWidth,
  } = getViewportDimensions();

  const widthRatio = getWidthRatio(mapWidth, viewportWidth);
  
  // get the current centerpoint of the map
  const [currentMapState, setCurrentMapState] = useState({});

  const handleMapStateUpdate = (state) => { 
    setCurrentMapState(state);
    console.log('currentMapState', currentMapState);
  };


  return (
    <TransformWrapper
      limitToBounds={false}
      initialScale={0.4}
      // initialScale={widthRatio}
      minScale={0.3}
      // minScale={widthRatio * 0.9}
      maxScale={20}
    >
      <TransformComponent>
        <MapStateTracker 
          setCurrentMapState={handleMapStateUpdate}
        />
        <img
          src='map-pin.svg'
          alt='Map Pin'
          className={styles.mapPin}
          style={{
            top: firstPinCorrdinates.top,
            left: firstPinCorrdinates.left
          }}
        />
        <img src={mapFilePath} alt="Trail Map" />
      </TransformComponent>
    </TransformWrapper>
  )
}