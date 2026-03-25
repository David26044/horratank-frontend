import api from './axios';

// ── Auth ──────────────────────────────────────────────────

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (firstName, lastName, email, password) => {
  return api.post('/auth/register', { firstName, lastName, email, password });
};

// ── Estaciones ────────────────────────────────────────────

// UC-005 / UC-007 — listado con filtros
export const getStations = (filters = {}) => {
  return api.get('/stations', { params: filters });
};

// UC-006 — estaciones cercanas
export const getNearbyStations = (lat, lng, filters = {}) => {
  return api.get('/stations/nearby', {
    params: { lat, lng, ...filters },
  });
};

// UC-008 — detalle de una estación
export const getStationDetail = (id) => {
  return api.get(`/stations/${id}`);
};

// UC-009 — URL de ruta hacia la estación
export const getRouteUrl = (id, originLat, originLng) => {
  return api.get(`/stations/${id}/route`, {
    params: { originLat, originLng },
  });
};

// UC-004 — zonas para el dropdown
export const getZones = () => {
  return api.get('/stations/zones');
};