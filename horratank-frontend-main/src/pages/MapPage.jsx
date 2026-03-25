import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStations, getNearbyStations } from '../api/stations';
import FilterPanel   from '../components/FilterPanel';
import MapView       from '../components/MapView';
import StationDetail from '../components/StationDetail';
import './MapPage.css';

function MapPage() {
  const navigate = useNavigate();

  const [stations,        setStations]        = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [userLocation,    setUserLocation]    = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [isNearby,        setIsNearby]        = useState(false);
  const [lastFilters,     setLastFilters]      = useState({});

  // ── Carga inicial — todas las estaciones ──────────────────
  useEffect(() => {
    fetchStations({});
  }, []);

  // ── Pide ubicación al montar ──────────────────────────────
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Usuario negó el permiso — no pasa nada, sigue sin ubicación
          setUserLocation(null);
        }
      );
    }
  }, []);

  // ── Buscar estaciones con filtros ─────────────────────────
  const fetchStations = useCallback(async (filters) => {
    setLoading(true);
    setSelectedStation(null);
    try {
      // Limpia params vacíos antes de enviar
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      const res = await getStations(params);
      setStations(res.data);
    } catch {
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Buscar estaciones cercanas ────────────────────────────
  const fetchNearby = useCallback(async (filters) => {
    if (!userLocation) {
      alert('Activa el GPS para buscar estaciones cercanas.');
      return;
    }
    setLoading(true);
    setSelectedStation(null);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      const res = await getNearbyStations(
        userLocation.lat,
        userLocation.lng,
        params
      );
      setStations(res.data);
    } catch {
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  // ── Cuando el usuario presiona Buscar ─────────────────────
  const handleSearch = (filters) => {
    setLastFilters(filters);
    if (isNearby) {
      fetchNearby(filters);
    } else {
      fetchStations(filters);
    }
  };

  // ── Cuando el usuario activa/desactiva "Cercanas a mí" ───
  const handleNearbyToggle = (checked) => {
    setIsNearby(checked);
    if (checked) {
      fetchNearby(lastFilters);
    } else {
      fetchStations(lastFilters);
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="map-page">

      {/* Navbar */}
      <nav className="map-navbar">
        <div className="map-navbar-brand">
          <span>⛽</span> Ahorra Tank
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="map-navbar-user">
            {userLocation ? '📍 Ubicación activa' : '📍 Sin ubicación'}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </nav>

      {/* Filtros + Mapa + Detalle */}
      <div className="map-content">

        <FilterPanel
          onSearch={handleSearch}
          onNearbyToggle={handleNearbyToggle}
          loading={loading}
        />

        <MapView
          stations={stations}
          userLocation={userLocation}
          loading={loading}
          onStationClick={setSelectedStation}
        />

        {selectedStation && (
          <StationDetail
            station={selectedStation}
            userLocation={userLocation}
            onClose={() => setSelectedStation(null)}
          />
        )}

      </div>
    </div>
  );
}

export default MapPage;