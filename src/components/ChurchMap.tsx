import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CHURCH_ADDRESS, CHURCH_COORDS } from '../data/events';

// Custom on-brand marker (burgundy pin with a white center). Avoids the
// broken default Leaflet icon paths that ship from a CDN.
const churchIcon = L.divIcon({
  className: 'church-map-marker',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -38],
  html: `<svg viewBox="0 0 24 32" width="32" height="42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z" fill="#8B1E24" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
  </svg>`,
});

export function ChurchMap() {
  return (
    <div
      className="overflow-hidden rounded-card border border-soft-border"
      style={{ height: 280 }}
    >
      <MapContainer
        center={[CHURCH_COORDS.lat, CHURCH_COORDS.lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[CHURCH_COORDS.lat, CHURCH_COORDS.lng]} icon={churchIcon}>
          <Popup>
            <strong>Bethesda Evangelical Church</strong>
            <br />
            {CHURCH_ADDRESS}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
