import { Link } from 'react-router-dom';
import Register from '../components/auth/Register';
import '../styles/auth.css';

const RegisterPage = ({ onRegister }) => {
  return (
    <div className="auth-page">
      <Register onRegister={onRegister} />
    </div>
  );
};

export default RegisterPage;

