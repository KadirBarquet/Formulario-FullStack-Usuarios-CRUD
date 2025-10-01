import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { register as registerUser } from '../../services/usuariosService';
import { 
  VALIDATION_MESSAGES, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  CIUDADES_ECUADOR,
  GENEROS 
} from '../../utils/constants';

// Esquema de validación con Yup
const registerSchema = yup.object({
  dni: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .matches(/^\d{10}$/, VALIDATION_MESSAGES.DNI_INVALID),
  nombres: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.NAMES_MIN),
  apellidos: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.NAMES_MIN),
  fecha_nacimiento: yup
    .date()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .max(new Date(), VALIDATION_MESSAGES.DATE_FUTURE)
    .test('age', VALIDATION_MESSAGES.AGE_MIN, function(value) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return value <= cutoff;
    }),
  genero: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(['masculino', 'femenino'], 'Selecciona un género válido'),
  ciudad: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
});

const Register = ({ onRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Configurar react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      genero: '',
    }
  });

  // Manejar el envío del formulario
  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await registerUser(data);

      if (response.success) {
        // Llamar a la función onRegister pasada por props
        onRegister(response.data);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setErrorMessage(error.message || ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <div className="auth-header">
        <div className="auth-logo">📝</div>
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Completa el formulario para registrarte</p>
      </div>

      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        {/* DNI */}
        <div className="form-group">
          <label htmlFor="dni" className="form-label required">
            DNI / Cédula
          </label>
          <input
            id="dni"
            type="text"
            className={`form-input ${errors.dni ? 'error' : ''}`}
            placeholder="0123456789"
            maxLength="10"
            {...register('dni')}
            disabled={isLoading}
          />
          {errors.dni && (
            <span className="form-error">{errors.dni.message}</span>
          )}
        </div>

        {/* Nombres y Apellidos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombres" className="form-label required">
              Nombres
            </label>
            <input
              id="nombres"
              type="text"
              className={`form-input ${errors.nombres ? 'error' : ''}`}
              placeholder="Juan Carlos"
              {...register('nombres')}
              disabled={isLoading}
            />
            {errors.nombres && (
              <span className="form-error">{errors.nombres.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="apellidos" className="form-label required">
              Apellidos
            </label>
            <input
              id="apellidos"
              type="text"
              className={`form-input ${errors.apellidos ? 'error' : ''}`}
              placeholder="Pérez González"
              {...register('apellidos')}
              disabled={isLoading}
            />
            {errors.apellidos && (
              <span className="form-error">{errors.apellidos.message}</span>
            )}
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div className="form-group">
          <label htmlFor="fecha_nacimiento" className="form-label required">
            Fecha de Nacimiento
          </label>
          <input
            id="fecha_nacimiento"
            type="date"
            className={`form-input ${errors.fecha_nacimiento ? 'error' : ''}`}
            {...register('fecha_nacimiento')}
            disabled={isLoading}
          />
          {errors.fecha_nacimiento && (
            <span className="form-error">{errors.fecha_nacimiento.message}</span>
          )}
        </div>

        {/* Género */}
        <div className="form-group">
          <label className="form-label required">Género</label>
          <div className="gender-radio-group">
            {GENEROS.map((genero) => (
              <div key={genero.value} className="gender-radio-option">
                <input
                  type="radio"
                  id={`genero-${genero.value}`}
                  value={genero.value}
                  {...register('genero')}
                  disabled={isLoading}
                />
                <label 
                  htmlFor={`genero-${genero.value}`} 
                  className="gender-radio-label"
                >
                  {genero.label}
                </label>
              </div>
            ))}
          </div>
          {errors.genero && (
            <span className="form-error">{errors.genero.message}</span>
          )}
        </div>

        {/* Ciudad */}
        <div className="form-group">
          <label htmlFor="ciudad" className="form-label required">
            Ciudad
          </label>
          <select
            id="ciudad"
            className={`form-select ${errors.ciudad ? 'error' : ''}`}
            {...register('ciudad')}
            disabled={isLoading}
          >
            <option value="">Selecciona una ciudad</option>
            {CIUDADES_ECUADOR.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          {errors.ciudad && (
            <span className="form-error">{errors.ciudad.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label required">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="tu@email.com"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label htmlFor="password" className="form-label required">
            Contraseña
          </label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}
        </div>

        {/* Botón de submit */}
        <div className="auth-form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>

      {/* Enlace a login */}
      <div className="auth-form-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </div>
    </div>
  );
};

export default Register;



