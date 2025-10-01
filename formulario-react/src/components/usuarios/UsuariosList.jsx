import { useState, useEffect } from 'react';
import { getUsuarios, deleteUsuario } from '../../services/usuariosService';
import UsuarioItem from './UsuarioItem';
import UsuarioForm from './UsuarioForm';
import UsuarioDetail from './UsuarioDetail';
import '../../styles/usuarios.css';
import '../../styles/dashboard.css';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [usuarioToDetail, setUsuarioToDetail] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter((usuario) => {
        const search = searchTerm.toLowerCase();
        return (
          usuario.nombres.toLowerCase().includes(search) ||
          usuario.apellidos.toLowerCase().includes(search) ||
          usuario.email.toLowerCase().includes(search) ||
          usuario.dni.includes(search) ||
          usuario.ciudad.toLowerCase().includes(search)
        );
      });
      setFilteredUsuarios(filtered);
    }
  }, [searchTerm, usuarios]);

  // Obtener usuarios del backend
  const fetchUsuarios = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getUsuarios();
      if (response.success) {
        setUsuarios(response.data);
        setFilteredUsuarios(response.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setErrorMessage('Error al cargar usuarios. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para crear usuario
  const handleCreate = () => {
    setUsuarioToEdit(null);
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleEdit = (usuario) => {
    setUsuarioToEdit(usuario);
    setShowModal(true);
  };

  // Abrir modal para ver detalles
  const handleDetail = (usuario) => {
    setUsuarioToDetail(usuario);
    setShowDetailModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioToEdit(null);
  };

  // Después de crear/editar con éxito
  const handleSuccess = () => {
    fetchUsuarios();
  };

  // Confirmar eliminación
  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowConfirmDelete(true);
  };

  // Eliminar usuario
  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;

    try {
      const response = await deleteUsuario(usuarioToDelete.id);
      if (response.success) {
        fetchUsuarios();
        setShowConfirmDelete(false);
        setUsuarioToDelete(null);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario. Intenta nuevamente.');
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setUsuarioToDelete(null);
  };

  // Calcular estadísticas
  const stats = {
    total: usuarios.length,
    masculino: usuarios.filter((u) => u.genero === 'masculino').length,
    femenino: usuarios.filter((u) => u.genero === 'femenino').length,
  };

  if (isLoading) {
    return (
      <div className="usuarios-loading">
        <div className="spinner"></div>
        <p className="usuarios-loading-text">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header con búsqueda y botón crear */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Administra los usuarios del sistema
          </p>
        </div>
        <div className="dashboard-actions">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, email, DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            ➕ Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total</p>
              <p className="stat-card-value">{stats.total}</p>
            </div>
            <span className="stat-card-icon">👥</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Masculino</p>
              <p className="stat-card-value">{stats.masculino}</p>
            </div>
            <span className="stat-card-icon">👨</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Femenino</p>
              <p className="stat-card-value">{stats.femenino}</p>
            </div>
            <span className="stat-card-icon">👩</span>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}

      {/* Lista de usuarios */}
      {filteredUsuarios.length === 0 ? (
        <div className="usuarios-empty">
          <div className="usuarios-empty-icon">
            {searchTerm ? '🔍' : '📋'}
          </div>
          <h3 className="usuarios-empty-title">
            {searchTerm ? 'No se encontraron resultados' : 'No hay usuarios'}
          </h3>
          <p className="usuarios-empty-text">
            {searchTerm
              ? 'Intenta con otro término de búsqueda'
              : 'Comienza agregando tu primer usuario'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreate}>
              ➕ Crear Primer Usuario
            </button>
          )}
        </div>
      ) : (
        <div className="usuarios-grid">
          {filteredUsuarios.map((usuario) => (
            <UsuarioItem
              key={usuario.id}
              usuario={usuario}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onDetail={handleDetail}
            />
          ))}
        </div>
      )}

      {/* Modal de crear/editar */}
      {showModal && (
        <UsuarioForm
          usuarioToEdit={usuarioToEdit}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}

      {/* Confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <h3 className="confirm-title">
                <span className="confirm-icon">⚠️</span>
                Confirmar Eliminación
              </h3>
            </div>
            <div className="confirm-body">
              <p>
                ¿Estás seguro de que deseas eliminar al usuario{' '}
                <strong>
                  {usuarioToDelete?.nombres} {usuarioToDelete?.apellidos}
                </strong>
                ?
              </p>
              <p style={{ marginTop: '0.5rem', color: 'var(--error-color)' }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="confirm-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailModal && (
        <UsuarioDetail
          usuarioId={usuarioToDetail.id}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default UsuariosList;


