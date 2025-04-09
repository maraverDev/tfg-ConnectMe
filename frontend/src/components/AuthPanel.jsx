import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import api from '../api';

function AuthPanel({ onLogin, onRegister }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    return location.pathname === '/register' ? 'register' : 'login';
  };

  const [tab, setTab] = useState(getInitialTab());
  const [loading, setLoading] = useState(true);

  // ✅ Comprobar si ya hay sesión iniciada (cookie válida)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/user');
        if (response.data) {
          onLogin(response.data);       // Establece usuario global
          navigate('/home');            // Redirige a home si hay sesión
        }
      } catch (err) {
        console.log('No autenticado');
        // Es normal si no hay sesión aún
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Cambiar de pestaña según la URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setTab('register');
    } else {
      setTab('login');
    }
  }, [location.pathname]);

  // ✅ Cambiar de pestaña manualmente
  const handleTabChange = (newTab) => {
    setTab(newTab);
    navigate(`/${newTab}`);
  };

  // ✅ Cuando se loguea o registra con éxito
  const handleLogin = (userData) => {
    onLogin(userData);
    navigate('/home');
  };

  const handleRegister = (userData) => {
    onRegister(userData);
    navigate('/home');
  };

  // ✅ Mientras se comprueba la sesión
  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleTabChange('login')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'login' ? 'border-indigo-600 text-indigo-600' : 'text-gray-500'
          }`}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => handleTabChange('register')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ml-4 ${
            tab === 'register' ? 'border-indigo-600 text-indigo-600' : 'text-gray-500'
          }`}
        >
          Registrarse
        </button>
      </div>

      {tab === 'login' ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Register onRegister={handleRegister} />
      )}
    </div>
  );
}

export default AuthPanel;
