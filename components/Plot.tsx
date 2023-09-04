import "leaflet/dist/leaflet.css";
import styles from "@/components/Plot.module.css";

import { getGradientStart } from "@/utils/color";
import { Coordinates } from "@/types/Vector";
import { Overlay } from "@/types/Overlay";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ImageOverlay,
} from "react-leaflet";

import { createMapIcon } from "@/components/MapIcon";

type Props = {
  path: Coordinates[];
  overlay?: Overlay;
};

export default function Plot(props: Props) {
  const { path, overlay } = props;
  console.log("path", path);

  function addPointToMap(point: Coordinates, index: number) {
    console.log("point", point);
    return (
      <Marker
        position={[point.latitude, point.longitude]}
        icon={createMapIcon("FF0000")} // this is throwing an error, but it works
        key={`point-${index}}`}
      >
        <Popup>
          Point {index} <br />
          Longitude: {point.longitude} <br />
          Latitude: {point.latitude}
        </Popup>
      </Marker>
    );
  }

  // Calculate Center
  const getAveragePosition = (path: Coordinates[]): Coordinates => {
    let lat = 0;
    let long = 0;
    path.forEach((coordinate) => {
      lat += coordinate.latitude;
      long += coordinate.longitude;
    });
    return {
      latitude: lat / path.length,
      longitude: long / path.length,
    };
  };

  const calculateCenter = (path: Coordinates[]): number[] => {
    if (path) {
      const { latitude, longitude } = getAveragePosition(path);
      return [latitude, longitude];
    }

    return overlay ? overlay.center : [0, 0];
  };

  // Component
  return (
    <MapContainer
      center={calculateCenter(path)} // this is throwing an error, but it works
      zoom={15}
      scrollWheelZoom={true}
      className={styles.plot}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {path && path.map((point, index) => addPointToMap(point, index))}
      {overlay && (
        <ImageOverlay
          url={overlay.url}
          bounds={overlay.bounds}
          opacity={0.8} // this is throwing an error, but it works
          zIndex={10}
        />
      )}
    </MapContainer>
  );
}
