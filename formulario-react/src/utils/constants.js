// URL base del backend
export const API_URL = 'http://localhost:5000/api';

// Ciudades de Ecuador
export const CIUDADES_ECUADOR = [
  'Quito',
  'Guayaquil',
  'Cuenca',
  'Santo Domingo',
  'Machala',
  'Durán',
  'Portoviejo',
  'Manta',
  'Loja',
  'Ambato',
  'Esmeraldas',
  'Quevedo',
  'Riobamba',
  'Milagro',
  'Ibarra',
  'La Libertad',
  'Babahoyo',
  'Sangolquí',
  'Daule',
  'Latacunga',
  'Machachi',
  'Santa Elena',
  'Salinas',
  'Tulcán',
  'Azogues'
];

// Opciones de género
export const GENEROS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' }
];

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'Email inválido',
  PASSWORD_MIN: 'La contraseña debe tener al menos 6 caracteres',
  DNI_INVALID: 'DNI debe tener 10 dígitos',
  AGE_MIN: 'Debes ser mayor de 18 años',
  NAMES_MIN: 'Debe tener al menos 2 caracteres',
  DATE_FUTURE: 'La fecha no puede ser futura'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN: 'Inicio de sesión exitoso',
  REGISTER: 'Usuario registrado exitosamente',
  CREATE: 'Usuario creado exitosamente',
  UPDATE: 'Usuario actualizado exitosamente',
  DELETE: 'Usuario eliminado exitosamente'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  GENERIC: 'Ocurrió un error. Intenta nuevamente',
  NETWORK: 'Error de conexión. Verifica tu internet',
  LOGIN_FAILED: 'Credenciales incorrectas',
  NOT_FOUND: 'Usuario no encontrado'
};




