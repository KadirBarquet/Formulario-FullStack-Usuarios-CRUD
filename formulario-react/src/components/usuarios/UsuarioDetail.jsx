import { useState, useEffect, useCallback } from 'react';
import { getUsuariobyId } from '../../services/usuariosService';
import '../../styles/usuarios.css';
import '../../styles/dashboard.css';

const UsuarioDetail = ({ usuarioId, onClose }) => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Obtener detalles del usuario
  const fetchUsuarioDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getUsuariobyId(usuarioId);
      if (response.success) {
        setUsuario(response.data);
      }
    } catch (error) {
      console.error('Error al cargar detalles del usuario:', error);
      setErrorMessage('Error al cargar detalles del usuario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId]);

  // Cargar detalles del usuario al montar
  useEffect(() => {
    fetchUsuarioDetail();
  }, [fetchUsuarioDetail]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener iniciales para el avatar
  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres?.charAt(0) || '';
    const lastInitial = apellidos?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Calcular edad
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body">
            <div className="usuarios-loading">
              <div className="spinner"></div>
              <p className="usuarios-loading-text">Cargando detalles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !usuario) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">👤 Detalles del Usuario</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="alert alert-error">
              {errorMessage || 'Usuario no encontrado'}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">👤 Detalles del Usuario</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Avatar y nombre */}
          <div className="usuario-detail-header">
            <div className="usuario-avatar-large">
              {getInitials(usuario.nombres, usuario.apellidos)}
            </div>
            <div className="usuario-detail-info">
              <h3 className="usuario-detail-name">
                {usuario.nombres} {usuario.apellidos}
              </h3>
              <p className="usuario-detail-email">{usuario.email}</p>
            </div>
          </div>

          {/* Información detallada */}
          <div className="usuario-detail-grid">
            <div className="usuario-detail-item">
              <span className="usuario-detail-label">DNI / Cédula</span>
              <span className="usuario-detail-value">{usuario.dni}</span>
            </div>

            <div className="usuario-detail-item">
              <span className="usuario-detail-label">Fecha de Nacimiento</span>
              <span className="usuario-detail-value">
                {formatDate(usuario.fecha_nacimiento)} ({calculateAge(usuario.fecha_nacimiento)} años)
              </span>
            </div>

            <div className="usuario-detail-item">
              <span className="usuario-detail-label">Género</span>
              <span className="usuario-detail-value">
                <span className={`usuario-badge ${usuario.genero}`}>
                  {usuario.genero}
                </span>
              </span>
            </div>

            <div className="usuario-detail-item">
              <span className="usuario-detail-label">Ciudad</span>
              <span className="usuario-detail-value">{usuario.ciudad}</span>
            </div>

            <div className="usuario-detail-item">
              <span className="usuario-detail-label">Email</span>
              <span className="usuario-detail-value">{usuario.email}</span>
            </div>

            <div className="usuario-detail-item">
              <span className="usuario-detail-label">ID de Usuario</span>
              <span className="usuario-detail-value">{usuario.id}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetail;
