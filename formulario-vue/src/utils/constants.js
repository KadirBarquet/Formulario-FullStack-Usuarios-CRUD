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
  { value: 'masculino', label: 'Masculino', icon: '👨' },
  { value: 'femenino', label: 'Femenino', icon: '👩' }
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
  LOGIN: '¡Bienvenido! Inicio de sesión exitoso',
  REGISTER: '¡Cuenta creada! Bienvenido al sistema',
  CREATE: 'Usuario creado exitosamente',
  UPDATE: 'Usuario actualizado correctamente',
  DELETE: 'Usuario eliminado del sistema'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  GENERIC: 'Ocurrió un error. Por favor intenta nuevamente',
  NETWORK: 'Error de conexión. Verifica tu internet',
  LOGIN_FAILED: 'Email o contraseña incorrectos',
  NOT_FOUND: 'Usuario no encontrado',
  UNAUTHORIZED: 'No tienes permisos para esta acción'
};



