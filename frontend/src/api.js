import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Laravel backend
  withCredentials: true, // Esto es importante para enviar cookies de sesión
});
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
api.interceptors.request.use((config) => {
  const matches = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
  if (matches) {
    const decoded = decodeURIComponent(matches[2]);
    config.headers["X-XSRF-TOKEN"] = decoded;
  }
  return config;
});

export default api;
