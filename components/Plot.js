import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';

import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';

import { createMapIcon } from '@/components/MapIcon';

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
  const overlays = [
    {
      url: '../images/trailmap-timberlands-precise-1.jpeg',
      trailBounds: [[41.3545, -72.6965], [41.3289, -72.6666]],
    },
    {
      url: '../images/trailmap-timberlands-precise-2.jpeg',      
      trailBounds: [[41.35422, -72.6926], [41.328, -72.66833]],
    }
  ];

  const OVERLAY_INDEX = 0;
  const trailURL = overlays[OVERLAY_INDEX].url;
  const trailBounds = overlays[OVERLAY_INDEX].trailBounds;

  const averageArray = (numbers) => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
  };

  const overlayCenter = [
    averageArray(trailBounds.map(coord => coord[0])),
    averageArray(trailBounds.map(coord => coord[1]))
  ];
 
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
          url={trailURL}
          bounds={trailBounds}
          opacity={0.9}
          zIndex={10}
        />}
    </MapContainer>
  )
}
