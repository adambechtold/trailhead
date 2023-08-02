import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';

import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';

import { createMapIcon } from '@/components/MapIcon';

export default function Plot({
  pins,
  showOverlay,
}) {

  const showPin = (pin) => {
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

  const averageArray = (numbers) => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
  };

  const trailBounds = [[41.3539, -72.69313], [41.328, -72.6685]];
  const overlayCenter = [
    averageArray(trailBounds.map(coord => coord[0])),
    averageArray(trailBounds.map(coord => coord[1]))
  ];
  const trailURL = '../images/trail-map-smaller.jpeg';

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

  return (
    <MapContainer center={calculateCenter(pins)} zoom={14} scrollWheelZoom={true} className={styles.plot}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins && pins.map(showPin)}
      {showOverlay &&
        <ImageOverlay
          url={trailURL}
          bounds={trailBounds}
          opacity={0.7}
          zIndex={10}
        />}
    </MapContainer>
  )
}
