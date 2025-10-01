import pool from '../config/database.js';

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!dni || !nombres || !apellidos || !fecha_nacimiento || !genero || !ciudad || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar género
    const allowedGenders = ['masculino', 'femenino'];
    if (!allowedGenders.includes(genero.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'El género debe ser "masculino" o "femenino"'
      });
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase();

    // Verificar si el email ya existe
    const emailExists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [normalizedEmail]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Insertar usuario en la base de datos (contraseña sin hashear)
    const result = await pool.query(
      `INSERT INTO usuarios (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email`,
      [dni, nombres, apellidos, fecha_nacimiento, genero.toLowerCase(), ciudad, normalizedEmail, password]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase();

    // Buscar usuario por email
    const result = await pool.query(
      'SELECT id, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password FROM usuarios WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];

    // Verificar contraseña (comparación directa sin hash)
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Remover password del objeto user antes de enviarlo
    delete user.password;

    res.json({
      success: true,
      message: 'Login exitoso',
      data: user
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};