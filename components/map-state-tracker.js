// This exists because we can only use useTransformEffect and useTransformInit in the same component as the TransformWrapper
import { useTransformEffect, useTransformInit } from "react-zoom-pan-pinch";

export default function MapStateTracker({ setCurrentMapState }) {
  
  useTransformEffect(({ state, instance }) => {
    setCurrentMapState(state);
  });

  useTransformInit(({ state, instance }) => {
    setCurrentMapState(state);
  });

  return (
    <></>
  )
}