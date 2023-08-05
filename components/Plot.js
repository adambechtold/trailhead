import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';

import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';

import { createMapIcon } from '@/components/MapIcon';
import { exampleOverlays } from '@/utils/plot';

export default function Plot({
  pins,
  showOverlay,
}) {

  const placePin = (pin) => {
    return (
      <Marker position={[pin.latitude, pin.longitude]} icon={createMapIcon(pin.color)} key={`pin-${pin.index}}`}>
        <Popup>
          Pin {pin.index} <br />
          Longitude: {pin.longitude} <br />
          Latitude: {pin.latitude}
        </Popup>
      </Marker>
    )
  };

  // OVERLAYS
  const OVERLAY_INDEX = 1;
  const overlayURL = exampleOverlays[OVERLAY_INDEX].url;
  const overlayBounds = exampleOverlays[OVERLAY_INDEX].bounds;
  const overlayCenter = exampleOverlays[OVERLAY_INDEX].center;
 
  // Calculate Center
  const getAveragePosition = (pins) => {
    let lat = 0;
    let long = 0;
    pins.forEach((pin) => {
      lat += pin.latitude;
      long += pin.longitude;
    });
    return [lat / pins.length, long / pins.length];
  };

  const calculateCenter = (pins) => {
    if (pins) {
      return getAveragePosition(pins);
    }

    return overlayCenter;
  }

  // Component
  return (
    <MapContainer center={calculateCenter(pins)} zoom={14} scrollWheelZoom={true} className={styles.plot}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins && pins.map(placePin)}
      {showOverlay &&
        <ImageOverlay
          url={overlayURL}
          bounds={overlayBounds}
          opacity={0.9}
          zIndex={10}
        />}
    </MapContainer>
  )
}
