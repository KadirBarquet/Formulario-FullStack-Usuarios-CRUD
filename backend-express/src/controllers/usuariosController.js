import pool from '../config/database.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/usuarios
// @access  Public
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email
       FROM usuarios 
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/usuarios/:id
// @access  Public
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email
       FROM usuarios 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// @desc    Crear nuevo usuario
// @route   POST /api/usuarios
// @access  Public
export const createUsuario = async (req, res) => {
  try {
    const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password } = req.body;

    // Validar campos requeridos
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

    // Verificar si el DNI ya existe
    const dniExists = await pool.query('SELECT id FROM usuarios WHERE dni = $1', [dni]);
    if (dniExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El DNI ya está registrado'
      });
    }

    // Verificar si el email ya existe
    const emailExists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [normalizedEmail]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Insertar usuario (contraseña sin hashear)
    const result = await pool.query(
      `INSERT INTO usuarios (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email`,
      [dni, nombres, apellidos, fecha_nacimiento, genero.toLowerCase(), ciudad, normalizedEmail, password]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/usuarios/:id
// @access  Public
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    let { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email, password } = req.body;

    // Verificar si el usuario existe
    const userExists = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el DNI ya existe en otro usuario
    if (dni) {
      const dniExists = await pool.query('SELECT id FROM usuarios WHERE dni = $1 AND id != $2', [dni, id]);
      if (dniExists.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El DNI ya está registrado en otro usuario'
        });
      }
    }

    // Verificar si el email ya existe en otro usuario
    if (email) {
      email = email.toLowerCase();
      const emailExists = await pool.query('SELECT id FROM usuarios WHERE email = $1 AND id != $2', [email, id]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado en otro usuario'
        });
      }
    }

    // Validar género si se actualiza
    if (genero && !['masculino', 'femenino'].includes(genero.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'El género debe ser "masculino" o "femenino"'
      });
    }

    // Construir query de actualización dinámicamente
    let updateFields = [];
    let values = [];
    let paramCounter = 1;

    if (dni) {
      updateFields.push(`dni = $${paramCounter++}`);
      values.push(dni);
    }
    if (nombres) {
      updateFields.push(`nombres = $${paramCounter++}`);
      values.push(nombres);
    }
    if (apellidos) {
      updateFields.push(`apellidos = $${paramCounter++}`);
      values.push(apellidos);
    }
    if (fecha_nacimiento) {
      updateFields.push(`fecha_nacimiento = $${paramCounter++}`);
      values.push(fecha_nacimiento);
    }
    if (genero) {
      updateFields.push(`genero = $${paramCounter++}`);
      values.push(genero.toLowerCase());
    }
    if (ciudad) {
      updateFields.push(`ciudad = $${paramCounter++}`);
      values.push(ciudad);
    }
    if (email) {
      updateFields.push(`email = $${paramCounter++}`);
      values.push(email);
    }
    if (password) {
      // Guardar contraseña sin hashear
      updateFields.push(`password = $${paramCounter++}`);
      values.push(password);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE usuarios 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, email
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/usuarios/:id
// @access  Public
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const userExists = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};