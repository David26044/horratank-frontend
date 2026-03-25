import axios from 'axios';
import L from 'leaflet';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const api = axios.create({
  baseURL: 'http://localhost:8080/system/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

// ── Fix íconos Leaflet + Vite ─────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:    markerIcon,
  shadowUrl:  markerShadow,
});

export default api;