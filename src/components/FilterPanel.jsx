import { useState, useEffect } from 'react';
import { getZones } from '../api/stations';
import './FilterPanel.css';

// Valores iniciales — facilita el reset
const INITIAL_FILTERS = {
  zone:          '',
  fuelType:      '',
  maxPrice:      '',
  availableOnly: true,
  nearby:        false,
};

function FilterPanel({ onSearch, onNearbyToggle, loading }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [zones, setZones]     = useState([]);

  // Carga las zonas del backend al montar
  useEffect(() => {
    getZones()
      .then(res => setZones(res.data))
      .catch(() => setZones([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    onSearch(INITIAL_FILTERS);
  };

  // Cuando cambia el checkbox de cercanas, avisa al padre
  const handleNearbyChange = (e) => {
    const checked = e.target.checked;
    setFilters(prev => ({ ...prev, nearby: checked }));
    onNearbyToggle(checked);
  };

  return (
    <div className="filter-panel">

      {/* Zona */}
      <div className="filter-group">
        <label htmlFor="zone">Localidad</label>
        <select
          id="zone"
          name="zone"
          value={filters.zone}
          onChange={handleChange}
        >
          <option value="">Todas</option>
          {zones.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Tipo de combustible */}
      <div className="filter-group">
        <label htmlFor="fuelType">Combustible</label>
        <select
          id="fuelType"
          name="fuelType"
          value={filters.fuelType}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          <option value="REGULAR">Corriente</option>
          <option value="PREMIUM">Extra</option>
          <option value="DIESEL">ACPM</option>
          <option value="GAS">GNV</option>
        </select>
      </div>

      {/* Precio máximo */}
      <div className="filter-group">
        <label htmlFor="maxPrice">Precio máx. (galón)</label>
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Ej: 15200"
          min="0"
        />
      </div>

      {/* Solo disponibles */}
      <label className="filter-nearby">
        <input
          type="checkbox"
          name="availableOnly"
          checked={filters.availableOnly}
          onChange={handleChange}
        />
        Solo disponibles
      </label>

      {/* Cercanas a mí */}
      <label className="filter-nearby">
        <input
          type="checkbox"
          name="nearby"
          checked={filters.nearby}
          onChange={handleNearbyChange}
        />
        Cercanas a mí
      </label>

      {/* Acciones */}
      <div className="filter-actions">
        <button
          className="btn-search"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button
          className="btn-clear"
          onClick={handleClear}
          disabled={loading}
        >
          Limpiar
        </button>
      </div>

    </div>
  );
}

export default FilterPanel;