import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';
import L from 'leaflet';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Plot() {
  const mapIcon = L.icon({
    iconUrl: 'map-x.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer center={[41.33673, -72.68157]} zoom={13} scrollWheelZoom={true} className={styles.plot}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[41.33673, -72.68157]} icon={mapIcon} >
        <Popup>
          Adam's House
        </Popup>
      </Marker>
    </MapContainer>
  )
}
