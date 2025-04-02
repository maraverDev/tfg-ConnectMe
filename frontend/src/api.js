import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel backend
});

export default api;