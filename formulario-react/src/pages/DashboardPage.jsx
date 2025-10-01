import { useNavigate } from 'react-router-dom';
import UsuariosList from '../components/usuarios/UsuariosList';

const DashboardPage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-container">
          <div className="navbar-brand">
            🏢 Sistema de Usuarios
          </div>
          <div className="navbar-user">
            <div className="navbar-user-info">
              <span className="navbar-user-name">
                {user.nombres} {user.apellidos}
              </span>
              <span className="navbar-user-email">{user.email}</span>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="main-content">
        <div className="container">
          <UsuariosList />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;



