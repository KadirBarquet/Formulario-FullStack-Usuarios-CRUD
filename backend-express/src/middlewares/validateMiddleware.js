// Validar formato de email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validar DNI ecuatoriano (10 dígitos para cédula)
export const validateDNI = (dni) => {
  // Solo verifica que sean 10 dígitos
  return /^\d{10}$/.test(dni);
};

// Validar fecha de nacimiento (debe ser mayor de 18 años)
export const validateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
};

// Validar contraseña (mínimo 6 caracteres)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Middleware de validación para registro/creación
export const validateUserData = (req, res, next) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password } = req.body;
  const errors = [];

  // Validar DNI
  if (!dni) {
    errors.push('DNI es requerido');
  } else if (!validateDNI(dni)) {
    errors.push('DNI inválido (debe ser cédula ecuatoriana válida de 10 dígitos)');
  }

  // Validar nombres
  if (!nombres) {
    errors.push('Nombres son requeridos');
  } else if (nombres.length < 2) {
    errors.push('Nombres deben tener al menos 2 caracteres');
  }

  // Validar apellidos
  if (!apellidos) {
    errors.push('Apellidos son requeridos');
  } else if (apellidos.length < 2) {
    errors.push('Apellidos deben tener al menos 2 caracteres');
  }

  // Validar fecha de nacimiento
  if (!fecha_nacimiento) {
    errors.push('Fecha de nacimiento es requerida');
  } else if (!validateAge(fecha_nacimiento)) {
    errors.push('Debes ser mayor de 18 años');
  }

  // Validar género
  const validGeneros = ['masculino', 'femenino'];
  if (!genero) {
    errors.push('Género es requerido');
  } else if (!validGeneros.includes(genero)) {
    errors.push('Género inválido (debe ser: masculino ó femenino');
  }

  // Validar ciudad
  if (!ciudad) {
    errors.push('Ciudad es requerida');
  } else if (ciudad.length < 2) {
    errors.push('Ciudad debe tener al menos 2 caracteres');
  }

  // Validar email
  if (!email) {
    errors.push('Email es requerido');
  } else if (!validateEmail(email)) {
    errors.push('Email inválido');
  }

  // Validar password (solo si se proporciona, para permitir actualizaciones sin cambiar password)
  if (req.method === 'POST' || password) {
    if (!password) {
      errors.push('Contraseña es requerida');
    } else if (!validatePassword(password)) {
      errors.push('Contraseña debe tener al menos 6 caracteres');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

// Middleware de validación para actualización
export const validateUserUpdate = (req, res, next) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password } = req.body;
  const errors = [];

  // Validar DNI (si se proporciona)
  if (dni && !validateDNI(dni)) {
    errors.push('DNI inválido (debe ser cédula ecuatoriana válida de 10 dígitos)');
  }

  // Validar nombres (si se proporciona)
  if (nombres && nombres.length < 2) {
    errors.push('Nombres deben tener al menos 2 caracteres');
  }

  // Validar apellidos (si se proporciona)
  if (apellidos && apellidos.length < 2) {
    errors.push('Apellidos deben tener al menos 2 caracteres');
  }

  // Validar fecha de nacimiento (si se proporciona)
  if (fecha_nacimiento && !validateAge(fecha_nacimiento)) {
    errors.push('Debes ser mayor de 18 años');
  }

  // Validar género (si se proporciona)
  const validGeneros = ['masculino', 'femenino', 'otro'];
  if (genero && !validGeneros.includes(genero)) {
    errors.push('Género inválido (debe ser: masculino, femenino u otro)');
  }

  // Validar ciudad (si se proporciona)
  if (ciudad && ciudad.length < 2) {
    errors.push('Ciudad debe tener al menos 2 caracteres');
  }

  // Validar email (si se proporciona)
  if (email && !validateEmail(email)) {
    errors.push('Email inválido');
  }

  // Validar password (si se proporciona)
  if (password && !validatePassword(password)) {
    errors.push('Contraseña debe tener al menos 6 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};