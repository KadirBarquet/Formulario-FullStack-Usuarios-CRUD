import { Link } from 'react-router-dom';
import Login from '../components/auth/Login';
import '../styles/auth.css';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="auth-page">
      <Login onLogin={onLogin} />
      <div className="auth-form-link" style={{ position: 'absolute', bottom: '2rem', textAlign: 'center', width: '100%' }}>
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </div>
    </div>
  );
};

export default LoginPage;



