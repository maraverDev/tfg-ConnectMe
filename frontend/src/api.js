import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel backend
  withCredentials: true,  // Esto es importante para enviar cookies de sesión

});

export default api;