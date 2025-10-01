const UsuarioItem = ({ usuario, onEdit, onDelete, onDetail }) => {
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

  return (
    <div className="usuario-card">
      {/* Header con avatar */}
      <div className="usuario-card-header">
        <div className="usuario-avatar">
          {getInitials(usuario.nombres, usuario.apellidos)}
        </div>
        <div className="usuario-header-info">
          <h3 className="usuario-name">
            {usuario.nombres} {usuario.apellidos}
          </h3>
          <p className="usuario-email">{usuario.email}</p>
        </div>
      </div>

      {/* Body con información */}
      <div className="usuario-card-body">
        <div className="usuario-info-grid">
          <div className="usuario-info-item">
            <span className="usuario-info-label">DNI</span>
            <span className="usuario-info-value">{usuario.dni}</span>
          </div>

          <div className="usuario-info-item">
            <span className="usuario-info-label">Fecha de Nacimiento</span>
            <span className="usuario-info-value">
              {formatDate(usuario.fecha_nacimiento)} ({calculateAge(usuario.fecha_nacimiento)} años)
            </span>
          </div>

          <div className="usuario-info-item">
            <span className="usuario-info-label">Género</span>
            <span className="usuario-info-value">
              <span className={`usuario-badge ${usuario.genero}`}>
                {usuario.genero}
              </span>
            </span>
          </div>

          <div className="usuario-info-item">
            <span className="usuario-info-label">Ciudad</span>
            <span className="usuario-info-value">{usuario.ciudad}</span>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="usuario-card-footer">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onDetail(usuario)}
        >
          👁️ Ver Detalles
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onEdit(usuario)}
        >
          ✏️ Editar
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(usuario)}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default UsuarioItem;

