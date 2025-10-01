import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateUserData } from '../middlewares/validateMiddleware.js';

const router = express.Router();

// Rutas públicas (ya no requieren autenticación)
router.post('/register', validateUserData, register);
router.post('/login', login);

export default router;


