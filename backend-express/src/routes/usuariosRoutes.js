import express from 'express';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuariosController.js';
import { validateUserData, validateUserUpdate } from '../middlewares/validateMiddleware.js';

const router = express.Router();

// Todas las rutas son públicas (sin autenticación)
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', validateUserData, createUsuario);
router.put('/:id', validateUserUpdate, updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;

