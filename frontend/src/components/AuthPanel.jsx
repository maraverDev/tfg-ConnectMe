import { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AuthPanel({ onLogin, onRegister }) {
  const [tab, setTab] = useState('login'); // login | register

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setTab('login')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'login' ? 'border-indigo-600 text-indigo-600' : 'text-gray-500'
          }`}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => setTab('register')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ml-4 ${
            tab === 'register' ? 'border-indigo-600 text-indigo-600' : 'text-gray-500'
          }`}
        >
          Registrarse
        </button>
      </div>

      {tab === 'login' ? (
        <Login onLogin={onLogin} />
      ) : (
        <Register onRegister={onRegister} />
      )}
    </div>
  );
}

export default AuthPanel;
