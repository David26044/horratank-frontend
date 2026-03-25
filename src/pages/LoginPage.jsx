import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/stations';
import './LoginPage.css';

function LoginPage() {
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // En LoginPage.jsx — reemplaza el handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const res = await login(form.email, form.password);
    localStorage.setItem('token', res.data.token);

    // Decodifica el token para saber el rol
    const payload = JSON.parse(atob(res.data.token.split('.')[1]));
    const isOperator = payload.authorities?.some(
      a => a.authority === 'ROLE_OPERATOR'
    );

    navigate(isOperator ? '/operator' : '/map');
  } catch {
    setError('Correo o contraseña incorrectos');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <div className="login-logo">⛽</div>
          <h1 className="login-title">Ahorra Tank</h1>
          <p className="login-subtitle">Encuentra combustible al mejor precio</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

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
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register">Regístrate aquí</Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;