import { useState } from 'react';
import { registerEntry } from '../api/stations';
import './InventoryForm.css';

const INITIAL_FORM = {
  fuelType:        '',
  quantityGallons: '',
  invoiceNumber:   '',
};

const FUEL_LABELS = {
  REGULAR: 'Corriente',
  PREMIUM: 'Extra',
  DIESEL:  'ACPM',
  GAS:     'GNV',
};

function InventoryForm({ onSuccess }) {
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error,   setError]   = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(null);
    setError('');
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setSuccess(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const res = await registerEntry({
        fuelType:        form.fuelType,
        quantityGallons: parseFloat(form.quantityGallons),
        invoiceNumber:   form.invoiceNumber,
      });

      setSuccess(res.data);
      setForm(INITIAL_FORM);
      if (onSuccess) onSuccess();

    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrar la entrada';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-form">
      <h2 className="inventory-form-title">⛽ Registrar entrada de combustible</h2>

      <form className="inventory-form-fields" onSubmit={handleSubmit}>

        <div className="form-field">
          <label htmlFor="fuelType">Tipo de combustible</label>
          <select
            id="fuelType"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            {Object.entries(FUEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="quantityGallons">Cantidad (galones)</label>
          <input
            id="quantityGallons"
            type="number"
            name="quantityGallons"
            value={form.quantityGallons}
            onChange={handleChange}
            placeholder="Ej: 200"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="invoiceNumber">Número de factura / guía</label>
          <input
            id="invoiceNumber"
            type="text"
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
            placeholder="Ej: FAC-001"
            required
          />
        </div>

        {success && (
          <div className="form-success">
            ✔ Entrada registrada — Stock actual: {Number(success.quantityGallons).toLocaleString('es-CO')} gal ({success.status})
          </div>
        )}

        {error && (
          <div className="form-error">
            ✘ {error}
          </div>
        )}

        <div className="inventory-form-actions">
          <button
            type="submit"
            className="btn-confirm"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Confirmar registro'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}

export default InventoryForm;