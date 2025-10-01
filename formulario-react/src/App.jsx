import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

// Importar páginas de la aplicación
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Estado para manejar el usuario autenticado
  const [currentUser, setCurrentUser] = useState(() => {
    // Recuperar usuario del localStorage si existe
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Función para guardar usuario después del login
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Ruta raíz - redirige según autenticación */}
          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />

          {/* Ruta de Login */}
          <Route 
            path="/login" 
            element={
              currentUser ? 
                <Navigate to="/dashboard" /> : 
                <LoginPage onLogin={handleLogin} />
            } 
          />

          {/* Ruta de Registro */}
          <Route 
            path="/register" 
            element={
              currentUser ? 
                <Navigate to="/dashboard" /> : 
                <RegisterPage onRegister={handleLogin} />
            } 
          />

          {/* Ruta del Dashboard (protegida) */}
          <Route 
            path="/dashboard" 
            element={
              currentUser ? 
                <DashboardPage user={currentUser} onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />

          {/* Ruta 404 - No encontrada */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

