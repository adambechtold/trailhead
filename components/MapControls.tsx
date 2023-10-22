import React from "react";

import styles from "./MapControls.module.css";
import ZoomToUserButton from "./Buttons/ZoomToUserButton/ZoomToUserButton";

type Props = {
  zoomToImage?: () => void;
  resetImage?: () => void;
  zoomToFit?: () => void;
  zoomToUser?: () => void;
};

export default function MapControls({
  zoomToImage,
  zoomToFit,
  resetImage,
  zoomToUser,
}: Props) {
  return (
    <div className={styles.container}>
      {zoomToImage && <button onClick={zoomToImage}>Zoom to Image</button>}
      {resetImage && <button onClick={resetImage}>Reset Transform</button>}
      {zoomToFit && <button onClick={zoomToFit}>View Whole Map</button>}
      {zoomToUser && <ZoomToUserButton zoomToUser={zoomToUser} />}
    </div>
  );
}
