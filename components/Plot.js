import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';
import L from 'leaflet';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { getLineOfPins, createMapIcon } from '@/utils/plot';

export default function Plot() {

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

  const pins = [{
    index: 1,
    latitude: 41.33673,
    longitude: -72.68157,
  }, {
    index: 2,
    latitude: 41.3398,
    longitude: -72.68334
  }];

  const getAveragePosition = () => {
    let lat = 0;
    let long = 0;
    pins.forEach((pin) => {
      lat += pin.latitude;
      long += pin.longitude;
    });
    return [lat / pins.length, long / pins.length];
  };

  return (
    <MapContainer center={getAveragePosition(pins)} zoom={16} scrollWheelZoom={true} className={styles.plot}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {getLineOfPins({
        startPosition: pins[0],
        endPosition: pins[1],
        numberOfPins: 8,
      }).map(showPin)}
    </MapContainer>
  )
}
