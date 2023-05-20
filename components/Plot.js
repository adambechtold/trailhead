import 'leaflet/dist/leaflet.css';
import styles from '@/components/Plot.module.css';

import { MapContainer, TileLayer } from 'react-leaflet';

export default function Plot() {
  return (
      <MapContainer center={[41.33673, -72.68157]} zoom={13} scrollWheelZoom={true} className={styles.plot}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
  )
}
