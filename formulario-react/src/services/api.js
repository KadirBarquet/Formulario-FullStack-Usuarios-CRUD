import axios from 'axios';
import { API_URL } from '../utils/constants';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para requests (si necesitas agregar tokens en el futuro)
api.interceptors.request.use(
  (config) => {
    // Aquí podrías agregar un token si lo necesitas
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejo de errores globales)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de red
    if (!error.response) {
      console.error('Error de red:', error);
      return Promise.reject({
        message: 'Error de conexión. Verifica tu internet',
      });
    }

    // Manejar errores del servidor
    const errorMessage = error.response?.data?.message || 'Error en el servidor';
    console.error('Error del servidor:', errorMessage);

    return Promise.reject(error.response.data);
  }
);

export default api;