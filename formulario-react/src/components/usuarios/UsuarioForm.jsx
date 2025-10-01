import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUsuario, updateUsuario } from '../../services/usuariosService';
import { 
  VALIDATION_MESSAGES, 
  CIUDADES_ECUADOR,
  GENEROS 
} from '../../utils/constants';

// Esquema base (campos comunes)
const baseSchema = {
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
    .required(VALIDATION_MESSAGES.REQUIRED),
  ciudad: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
};

// Esquema para crear (password requerido)
const createSchema = yup.object({
  ...baseSchema,
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
});

// Esquema para editar (password opcional)
const updateSchema = yup.object({
  ...baseSchema,
  password: yup
    .string()
    .transform((value) => value === '' ? undefined : value)
    .notRequired()
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
});

const UsuarioForm = ({ usuarioToEdit, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = !!usuarioToEdit;

  // Configurar react-hook-form con el esquema apropiado
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(isEditing ? updateSchema : createSchema),
    defaultValues: usuarioToEdit ? {
      ...usuarioToEdit,
      fecha_nacimiento: usuarioToEdit.fecha_nacimiento?.split('T')[0],
    } : {},
  });

  // Reset form cuando cambia usuarioToEdit
  useEffect(() => {
    if (usuarioToEdit) {
      reset({
        ...usuarioToEdit,
        fecha_nacimiento: usuarioToEdit.fecha_nacimiento?.split('T')[0],
      });
    }
  }, [usuarioToEdit, reset]);

  // Manejar envío del formulario
  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let response;

      if (isEditing) {
        // Actualizar usuario
        const updateData = { ...data };
        // Si no se cambió la contraseña, no enviarla
        if (!updateData.password) {
          delete updateData.password;
        }
        response = await updateUsuario(usuarioToEdit.id, updateData);
      } else {
        // Crear nuevo usuario
        response = await createUsuario(data);
      }

      if (response.success) {
        onSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setErrorMessage(error.message || 'Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {errorMessage && (
            <div className="alert alert-error">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} id="usuario-form">
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
                      id={`modal-genero-${genero.value}`}
                      value={genero.value}
                      {...register('genero')}
                      disabled={isLoading}
                    />
                    <label 
                      htmlFor={`modal-genero-${genero.value}`} 
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
                placeholder="usuario@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password" className={`form-label ${!isEditing ? 'required' : ''}`}>
                Contraseña {isEditing && '(dejar vacío para no cambiar)'}
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder={isEditing ? 'Nueva contraseña (opcional)' : '••••••••'}
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
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="usuario-form"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;


