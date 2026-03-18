import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

// ── Ícono personalizado para estaciones ──
const stationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize:   [25, 41],
  iconAnchor: [12, 41],
  popupAnchor:[1, -34],
  shadowSize: [41, 41],
});

// ── Ícono azul para ubicación del usuario ──
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize:   [25, 41],
  iconAnchor: [12, 41],
  popupAnchor:[1, -34],
  shadowSize: [41, 41],
});

// ── Componente interno que mueve el mapa cuando cambia el centro ──
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1 });
    }
  }, [center, map]);
  return null;
}

const BOGOTA_CENTER = [4.6097, -74.0817];

function MapView({ stations, userLocation, loading, onStationClick }) {
  return (
    <div className="map-wrapper">

      {/* Spinner mientras carga */}
      {loading && (
        <div className="map-loading">
          <div className="map-spinner" />
          Buscando estaciones...
        </div>
      )}

      {/* Sin resultados */}
      {!loading && stations.length === 0 && (
        <div className="map-no-results">
          😕 No se encontraron estaciones con esos filtros
        </div>
      )}

      <MapContainer
        center={userLocation
          ? [userLocation.lat, userLocation.lng]
          : BOGOTA_CENTER}
        zoom={13}
        className="map-container"
        zoomControl={true}
      >
        {/* Mapa base — OpenStreetMap, sin API key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Mueve el mapa cuando cambia la ubicación */}
        <MapController
          center={userLocation
            ? [userLocation.lat, userLocation.lng]
            : null}
        />

        {/* Marcador del usuario */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>📍 Tu ubicación</Popup>
            </Marker>
            {/* Círculo de radio de búsqueda */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={5000}
              pathOptions={{ color: '#0f3460', fillOpacity: 0.05 }}
            />
          </>
        )}

        {/* Marcadores de estaciones */}
        {stations.map(station => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={stationIcon}
            eventHandlers={{
              click: () => onStationClick(station),
            }}
          >
            <Popup>
              <strong>{station.name}</strong><br />
              {station.zone}<br />
              <small>{station.address}</small>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}

export default MapView;