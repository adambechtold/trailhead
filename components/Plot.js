import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';
import L from 'leaflet';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Plot() {

  const createIconUrl = (color) => {
    const svgString = 
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.1475 18.3525C19.2028 18.404 19.2471 18.4661 19.2778 18.5351C19.3086 18.6041 19.3251 18.6786 19.3265 18.7541C19.3278 18.8296 19.3139 18.9047 19.2856 18.9747C19.2573 19.0447 19.2152 19.1084 19.1618 19.1618C19.1084 19.2152 19.0447 19.2573 18.9747 19.2856C18.9047 19.3139 18.8296 19.3278 18.7541 19.3265C18.6786 19.3251 18.6041 19.3086 18.5351 19.2778C18.4661 19.2471 18.404 19.2028 18.3525 19.1475L12 12.7959L5.64751 19.1475C5.54088 19.2469 5.39984 19.301 5.25411 19.2984C5.10839 19.2958 4.96935 19.2368 4.86629 19.1337C4.76323 19.0307 4.7042 18.8916 4.70163 18.7459C4.69905 18.6002 4.75315 18.4591 4.85251 18.3525L11.2041 12L4.85251 5.64751C4.75315 5.54088 4.69905 5.39984 4.70163 5.25411C4.7042 5.10839 4.76323 4.96935 4.86629 4.86629C4.96935 4.76323 5.10839 4.7042 5.25411 4.70163C5.39984 4.69905 5.54088 4.75315 5.64751 4.85251L12 11.2041L18.3525 4.85251C18.4591 4.75315 18.6002 4.69905 18.7459 4.70163C18.8916 4.7042 19.0307 4.76323 19.1337 4.86629C19.2368 4.96935 19.2958 5.10839 19.2984 5.25411C19.301 5.39984 19.2469 5.54088 19.1475 5.64751L12.7959 12L19.1475 18.3525Z" fill="#${color}"/>
    </svg>
    `;
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    return svgUrl;
  };

  const mapIcon = L.icon({
    iconUrl: createIconUrl('0000FF'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

  const showPin = (pin) => {
    return (
      <Marker position={[pin.latitude, pin.longitude]} icon={mapIcon} key={`pin-${pin.index}}`}>
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

  const getLineOfPins = ({
    startPosition,
    endPosition,
    numberOfPins,
  }) => {

    if (numberOfPins < 2) {
      throw new Error('numberOfPins must be greater than 1');
    }

    const line = [];
    const latDiff = (endPosition.latitude - startPosition.latitude) / (numberOfPins - 1);
    const longDiff = (endPosition.longitude - startPosition.longitude) / (numberOfPins - 1);
    for (let i = 0; i < numberOfPins; i++) {
      line.push({
        index: i,
        latitude: startPosition.latitude + (latDiff * i),
        longitude: startPosition.longitude + (longDiff * i),
      });
    }

    return line;
  };

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
