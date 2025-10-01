<template>
  <div class="auth-view">
    <!-- Lado Izquierdo -->
    <div class="auth-side-left">
      <div class="auth-brand">
        <div class="auth-brand-icon">🏢</div>
        <h1 class="auth-brand-title">Sistema de Usuarios</h1>
        <p class="auth-brand-subtitle">Gestión eficiente y segura</p>
      </div>
      
      <ul class="auth-features">
        <li class="auth-feature-item">
          <span class="auth-feature-icon">✅</span>
          <span>Gestión completa de usuarios</span>
        </li>
        <li class="auth-feature-item">
          <span class="auth-feature-icon">🔒</span>
          <span>Seguridad garantizada</span>
        </li>
        <li class="auth-feature-item">
          <span class="auth-feature-icon">⚡</span>
          <span>Interfaz rápida e intuitiva</span>
        </li>
      </ul>
    </div>

    <!-- Lado Derecho -->
    <div class="auth-side-right">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/auth/LoginForm.vue';
import '../styles/auth.css';

export default {
  name: 'LoginView',
  components: {
    LoginForm
  }
};
</script>


