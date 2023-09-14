import React, { useEffect } from "react";

import styles from "./MapControls.module.css";

type Props = {
  zoomToImage?: () => void;
  resetImage?: () => void;
  zoomToFit?: () => void;
};

export default function MapControls({
  zoomToImage,
  zoomToFit,
  resetImage,
}: Props) {
  return (
    <div className={styles.container}>
      {zoomToImage && <button onClick={zoomToImage}>Zoom to Image</button>}
      {resetImage && <button onClick={resetImage}>Reset Transform</button>}
      {zoomToFit && <button onClick={zoomToFit}>View Whole Map</button>}
    </div>
  );
}
