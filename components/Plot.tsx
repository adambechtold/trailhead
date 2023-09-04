import "leaflet/dist/leaflet.css";
import styles from "@/components/Plot.module.css";

import { Coordinates } from "@/types/Vector";
import { Overlay } from "@/types/Overlay";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ImageOverlay,
} from "react-leaflet";

import { LatLngExpression, LatLngBounds } from "leaflet";

import { createMapIcon } from "@/components/MapIcon";

type Props = {
  path?: Coordinates[];
  overlay?: Overlay;
};

export default function Plot(props: Props) {
  let { path, overlay } = props;
  if (!path) {
    path = [];
  }

  function addPointToMap(point: Coordinates, index: number) {
    return (
      <Marker
        position={[point.latitude, point.longitude]}
        icon={createMapIcon("FF0000")}
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

  const calculateCenter = (path: Coordinates[]): LatLngExpression => {
    if (path) {
      const { latitude, longitude } = getAveragePosition(path);
      return [latitude, longitude];
    }
    return overlay ? [overlay.center[0], overlay.center[1]] : [0, 0];
  };

  const getLatLngBounds = (overlay: Overlay): LatLngBounds => {
    return new LatLngBounds(
      [overlay.bounds[0][0], overlay.bounds[0][1]],
      [overlay.bounds[1][0], overlay.bounds[1][1]]
    );
  };

  // Component
  return (
    <MapContainer
      center={calculateCenter(path)}
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
          bounds={getLatLngBounds(overlay)}
          opacity={0.8}
          zIndex={10}
        />
      )}
    </MapContainer>
  );
}
