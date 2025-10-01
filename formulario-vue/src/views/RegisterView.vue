<template>
    <div class="auth-view">
        <!-- Lado Izquierdo -->
        <div class="auth-side-left">
            <div class="auth-brand">
                <div class="auth-brand-icon">📝</div>
                <h1 class="auth-brand-title">Únete a Nosotros</h1>
                <p class="auth-brand-subtitle">Crea tu cuenta en segundos</p>
            </div>

            <ul class="auth-features">
                <li class="auth-feature-item">
                    <span class="auth-feature-icon">🚀</span>
                    <span>Registro rápido y sencillo</span>
                </li>
                <li class="auth-feature-item">
                    <span class="auth-feature-icon">🔐</span>
                    <span>Datos protegidos y seguros</span>
                </li>
                <li class="auth-feature-item">
                    <span class="auth-feature-icon">✨</span>
                    <span>Acceso inmediato al sistema</span>
                </li>
            </ul>
        </div>

        <!-- Lado Derecho -->
        <div class="auth-side-right">
            <RegisterForm />
        </div>
    </div>
</template>

<script>
import RegisterForm from '../components/auth/RegisterForm.vue';
import '../styles/auth.css';

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  }
};
</script> 