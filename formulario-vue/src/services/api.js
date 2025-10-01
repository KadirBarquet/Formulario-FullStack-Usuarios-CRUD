import axios from 'axios';
import { API_URL } from '../utils/constants';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Error de red:', error);
      return Promise.reject({
        message: 'Error de conexión. Verifica tu internet',
      });
    }

    const errorMessage = error.response?.data?.message || 'Error en el servidor';
    console.error('Error del servidor:', errorMessage);

    return Promise.reject(error.response.data);
  }
);

export default api;

