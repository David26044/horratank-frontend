import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/stations';
import './LoginPage.css';
import logo from "../assets/logo.png";

function LoginPage() {
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      localStorage.setItem('token', res.data.token);
      navigate('/map');
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
          <img src={logo} className="login-logo-img" alt="logo" />
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

          <div className="form-field password-field">
            <label>Contraseña</label>

            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
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
