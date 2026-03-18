import { useState } from 'react';
import { getRouteUrl } from '../api/stations';
import './StationDetail.css';

const FUEL_LABELS = {
  REGULAR: 'Corriente',
  PREMIUM: 'Extra',
  DIESEL:  'ACPM',
  GAS:     'GNV',
};

function StationDetail({ station, userLocation, onClose }) {
  const [loadingRoute, setLoadingRoute] = useState(false);

  const handleRoute = async () => {
    setLoadingRoute(true);
    try {
      if (userLocation) {
        // Tiene ubicación — pide la URL al backend
        const res = await getRouteUrl(
          station.id,
          userLocation.lat,
          userLocation.lng
        );
        window.open(res.data.routeUrl, '_blank');
      } else {
        // Sin ubicación — abre Google Maps solo con destino
        const url = `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;
        window.open(url, '_blank');
      }
    } catch {
      alert('No se pudo generar la ruta. Intenta de nuevo.');
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <div className="station-detail">

      {/* Encabezado */}
      <div className="station-detail-header">
        <h3 className="station-detail-name">{station.name}</h3>
        <button className="station-detail-close" onClick={onClose}>✕</button>
      </div>

      {/* Dirección */}
      <p className="station-detail-address">
        📍 {station.address} · {station.zone}
      </p>

      {/* Combustibles */}
      <div className="station-detail-fuels">
        {station.fuels.map(fuel => (
          <div
            key={fuel.fuelType}
            className={`fuel-badge ${!fuel.isAvailable ? 'unavailable' : ''}`}
          >
            <span className="fuel-badge-type">
              {FUEL_LABELS[fuel.fuelType] ?? fuel.fuelType}
            </span>
            <span className="fuel-badge-price">
              ${Number(fuel.pricePerGallon).toLocaleString('es-CO')}
            </span>
            <span className={`fuel-badge-status ${fuel.isAvailable ? 'ok' : 'no'}`}>
              {fuel.isAvailable ? '✔ Disponible' : '✘ Agotado'}
            </span>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className="station-detail-actions">
        <button
          className="btn-route"
          onClick={handleRoute}
          disabled={loadingRoute}
        >
          {loadingRoute ? 'Abriendo...' : '🗺️ Cómo llegar'}
        </button>
      </div>

    </div>
  );
}

export default StationDetail;