import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/stations';
import './RegisterPage.css';

function RegisterPage() {
  const navigate              = useNavigate();
  const [form, setForm]       = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(
        form.firstName,
        form.lastName,
        form.email,
        form.password
      );
      localStorage.setItem('token', res.data.token);
      navigate('/map');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="register-header">
          <div className="register-logo">⛽</div>
          <h1 className="register-title">Crear cuenta</h1>
          <p className="register-subtitle">Regístrate para empezar a ahorrar</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="firstName">Nombre</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="lastName">Apellido</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@email.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

        </form>

        <p className="register-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión aquí</Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;