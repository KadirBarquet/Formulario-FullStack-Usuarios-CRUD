import api from './api';

// ============================================
// AUTENTICACIÓN
// ============================================

/*
 * Registrar un nuevo usuario
 * @param {Object} userData - Datos del usuario (dni, nombres, apellidos, etc.)
 * @returns {Promise} Respuesta con el usuario creado
*/ 
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
}

/*
 * Iniciar sesión
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Respuesta con los datos del usuario
*/
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
} 

// ============================================
// CRUD DE USUARIOS
// ============================================

/*
 * Obtener todos los usuarios
 * @returns {Promise} Array de usuarios
*/
export const getUsuarios = async () => {
    const response = await api.get('/usuarios');
    return response.data;
}

/*
 * Obtener un usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise} Datos del usuario
*/
export const getUsuariobyId = async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
}

/*
 * Crear un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise} Usuario creado
*/
export const createUsuario = async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
}

/*
 * Actualizar un usuario existente
 * @param {number} id - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise} Usuario actualizado
*/
export const updateUsuario = async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
}

/*
 * Eliminar un usuario
 * @param {number} id - ID del usuario
 * @returns {Promise} Confirmación de eliminación
*/
export const deleteUsuario = async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
}

