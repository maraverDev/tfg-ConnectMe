import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function AuthPanel({ onLogin, onRegister }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (location.pathname === '/register') return 'register';
    return 'login'; // default
  };

  const [tab, setTab] = useState(getInitialTab());

  // Si cambia la URL externamente (por ejemplo, alguien escribe /register)
  useEffect(() => {
    if (location.pathname === '/register') {
      setTab('register');
    } else {
      setTab('login');
    }
  }, [location.pathname]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    navigate(`/${newTab}`); // actualizamos la URL
  };

  const handleLogin = (userData) => {
    onLogin(userData);
    navigate('/home');
  };

  const handleRegister = (userData) => {
    onRegister(userData);
    navigate('/home');
  };

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
