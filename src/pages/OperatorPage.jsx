import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventory, getInventoryLog } from '../api/stations';
import InventoryForm from '../components/InventoryForm';
import './OperatorPage.css';

const FUEL_LABELS = {
  REGULAR: 'Corriente',
  PREMIUM: 'Extra',
  DIESEL:  'ACPM',
  GAS:     'GNV',
};

function OperatorPage() {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [log,       setLog]       = useState([]);
  const [loading,   setLoading]   = useState(true);

  // ── Carga inventario y bitácora ───────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, logRes] = await Promise.all([
        getInventory(),
        getInventoryLog(),
      ]);
      setInventory(invRes.data);
      setLog(logRes.data);
    } catch {
      setInventory([]);
      setLog([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="operator-page">

      {/* Navbar */}
      <nav className="operator-navbar">
        <div className="operator-navbar-brand">
          <span>⛽</span>
          Ahorra Tank
          <span className="operator-navbar-role">OPERADOR</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Salir
        </button>
      </nav>

      {/* Contenido */}
      <div className="operator-content">
        <h1>Panel de operador</h1>
        <p>Registra entradas de combustible y consulta el inventario de tu estación.</p>

        <div className="operator-grid">

          {/* Formulario de entrada */}
          <InventoryForm onSuccess={loadData} />

          {/* Inventario actual */}
          <div className="inventory-panel">
            <h2 className="inventory-panel-title">📦 Inventario actual</h2>

            {loading ? (
              <p className="inventory-loading">Cargando...</p>
            ) : inventory.length === 0 ? (
              <p className="inventory-empty">No hay inventario registrado.</p>
            ) : (
              <div className="inventory-list">
                {inventory.map((item) => (
                  <div
                    key={item.fuelType}
                    className={`inventory-item ${item.status}`}
                  >
                    <span className="inventory-item-fuel">
                      {FUEL_LABELS[item.fuelType] ?? item.fuelType}
                    </span>
                    <span className="inventory-item-qty">
                      {Number(item.quantityGallons).toLocaleString('es-CO')} gal
                    </span>
                    <span className={`inventory-item-status ${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bitácora */}
          <div className="log-panel">
            <h2 className="log-panel-title">📋 Bitácora de movimientos</h2>

            {loading ? (
              <p className="log-empty">Cargando...</p>
            ) : log.length === 0 ? (
              <p className="log-empty">No hay movimientos registrados.</p>
            ) : (
              <table className="log-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Combustible</th>
                    <th>Cantidad</th>
                    <th>Factura</th>
                    <th>Operador</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.createdAt)}</td>
                      <td>{FUEL_LABELS[entry.fuelType] ?? entry.fuelType}</td>
                      <td>{Number(entry.quantityAdded).toLocaleString('es-CO')} gal</td>
                      <td>{entry.invoiceNumber}</td>
                      <td>{entry.operatorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default OperatorPage;