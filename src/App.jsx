import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage      from './pages/MapPage';
import OperatorPage from './pages/OperatorPage';

function isTokenValid() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const auth = payload.authorities?.[0]?.authority;
    return auth === 'ROLE_OPERATOR' ? 'OPERATOR' : 'USER';
  } catch {
    return null;
  }
}

function PrivateRoute({ children }) {
  if (!isTokenValid()) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/map"
          element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/operator"
          element={
            <PrivateRoute>
              <OperatorPage />
            </PrivateRoute>
          }
        />

        {/* Redirige la raíz según rol */}
        <Route
          path="/"
          element={
            isTokenValid()
              ? getRole() === 'OPERATOR'
                ? <Navigate to="/operator" />
                : <Navigate to="/map" />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;