<template>
  <div class="dashboard-view">
    <!-- Navbar -->
    <nav class="dashboard-navbar">
      <div class="container navbar-content">
        <div class="navbar-brand">
          <span class="navbar-brand-icon">🏢</span>
          <div class="navbar-brand-text">
            <h2>Sistema de Usuarios</h2>
            <p>Panel de Administración</p>
          </div>
        </div>
        <div class="navbar-user">
          <div class="navbar-user-info">
            <span class="navbar-user-name">{{ currentUser?.nombres }} {{ currentUser?.apellidos }}</span>
            <span class="navbar-user-email">{{ currentUser?.email }}</span>
          </div>
          <button class="btn btn-logout btn-sm" @click="handleLogout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="dashboard-content">
      <div class="container">
        <UsuariosList />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UsuariosList from '../components/usuarios/UsuariosList.vue';
import '../styles/dashboard.css';

export default {
  name: 'DashboardView',
  components: {
    UsuariosList
  },
  setup() {
    const router = useRouter();
    const currentUser = ref(null);

    onMounted(() => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        currentUser.value = JSON.parse(savedUser);
      }
    });

    const handleLogout = () => {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        router.push('/login');
      }
    };

    return {
      currentUser,
      handleLogout
    };
  }
};
</script>