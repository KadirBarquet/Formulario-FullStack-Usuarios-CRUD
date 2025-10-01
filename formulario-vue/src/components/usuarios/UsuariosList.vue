<template>
  <div>
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h2 class="dashboard-title">Gestión de Usuarios</h2>
        <p class="dashboard-subtitle">Administra y controla los usuarios del sistema</p>
      </div>
      <div class="dashboard-actions">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchTerm"
            type="text"
            class="search-input"
            placeholder="Buscar por nombre, email, DNI..."
          />
        </div>
        <button class="btn btn-primary" @click="openModal()">
          ➕ Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-info">
            <h3>Total Usuarios</h3>
            <div class="stat-card-value">{{ stats.total }}</div>
          </div>
          <div class="stat-card-icon">👥</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-info">
            <h3>Masculino</h3>
            <div class="stat-card-value">{{ stats.masculino }}</div>
          </div>
          <div class="stat-card-icon">👨</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-info">
            <h3>Femenino</h3>
            <div class="stat-card-value">{{ stats.femenino }}</div>
          </div>
          <div class="stat-card-icon">👩</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p class="loading-text">Cargando usuarios...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredUsuarios.length === 0 && !isLoading" class="usuarios-container">
      <div class="empty-state">
        <div class="empty-state-icon">{{ searchTerm ? '🔍' : '📋' }}</div>
        <h3 class="empty-state-title">
          {{ searchTerm ? 'Sin resultados' : 'No hay usuarios' }}
        </h3>
        <p class="empty-state-text">
          {{ searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza creando tu primer usuario' }}
        </p>
        <button v-if="!searchTerm" class="btn btn-primary" @click="openModal()">
          ➕ Crear Primer Usuario
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="usuarios-container">
      <div class="usuarios-table-wrapper">
        <table class="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>DNI</th>
              <th>Fecha Nac.</th>
              <th>Género</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in filteredUsuarios" :key="usuario.id">
              <td>
                <div class="usuario-info-cell">
                  <div class="usuario-avatar">
                    {{ getInitials(usuario.nombres, usuario.apellidos) }}
                  </div>
                  <div class="usuario-details">
                    <h4>{{ usuario.nombres }} {{ usuario.apellidos }}</h4>
                    <p>{{ usuario.email }}</p>
                  </div>
                </div>
              </td>
              <td>{{ usuario.dni }}</td>
              <td>{{ formatDate(usuario.fecha_nacimiento) }}</td>
              <td>
                <span class="usuario-badge" :class="usuario.genero">
                  {{ usuario.genero === 'masculino' ? '👨' : '👩' }}
                  {{ usuario.genero }}
                </span>
              </td>
              <td>{{ usuario.ciudad }}</td>
              <td>
                <div class="usuario-actions">
                  <button class="btn btn-secondary btn-sm btn-icon" @click="viewDetail(usuario)" title="Ver Detalle">
                    👁️
                  </button>
                  <button class="btn btn-primary btn-sm btn-icon" @click="openModal(usuario)" title="Editar">
                    ✏️
                  </button>
                  <button class="btn btn-danger btn-sm btn-icon" @click="confirmDelete(usuario)" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile View -->
      <div class="usuarios-mobile-list">
        <div v-for="usuario in filteredUsuarios" :key="usuario.id" class="usuario-mobile-card">
          <div class="usuario-mobile-header">
            <div class="usuario-avatar">
              {{ getInitials(usuario.nombres, usuario.apellidos) }}
            </div>
            <div class="usuario-details">
              <h4>{{ usuario.nombres }} {{ usuario.apellidos }}</h4>
              <p>{{ usuario.email }}</p>
            </div>
          </div>
          <div class="usuario-mobile-body">
            <div class="usuario-mobile-row">
              <span class="usuario-mobile-label">DNI:</span>
              <span class="usuario-mobile-value">{{ usuario.dni }}</span>
            </div>
            <div class="usuario-mobile-row">
              <span class="usuario-mobile-label">Fecha Nac.:</span>
              <span class="usuario-mobile-value">{{ formatDate(usuario.fecha_nacimiento) }}</span>
            </div>
            <div class="usuario-mobile-row">
              <span class="usuario-mobile-label">Género:</span>
              <span class="usuario-badge" :class="usuario.genero">
                {{ usuario.genero === 'masculino' ? '👨' : '👩' }}
                {{ usuario.genero }}
              </span>
            </div>
            <div class="usuario-mobile-row">
              <span class="usuario-mobile-label">Ciudad:</span>
              <span class="usuario-mobile-value">{{ usuario.ciudad }}</span>
            </div>
          </div>
          <div class="usuario-mobile-actions">
            <button class="btn btn-secondary btn-sm" @click="viewDetail(usuario)">
              👁️ Ver
            </button>
            <button class="btn btn-primary btn-sm" @click="openModal(usuario)">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(usuario)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <UsuarioModal
      v-if="showModal"
      :usuario="selectedUsuario"
      @close="closeModal"
      @success="handleSuccess"
    />

    <!-- Detail Modal -->
    <UsuarioDetail
      v-if="showDetail"
      :usuario-id="selectedUsuarioId"
      @close="closeDetail"
    />

    <!-- Confirm Delete -->
    <div v-if="showConfirmDelete" class="modal-overlay" @click="cancelDelete">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-header">
          <h3 class="confirm-title">
            <span>⚠️</span>
            Confirmar Eliminación
          </h3>
        </div>
        <div class="confirm-body">
          <p>¿Estás seguro de eliminar al usuario <strong>{{ userToDelete?.nombres }} {{ userToDelete?.apellidos }}</strong>?</p>
          <p style="color: var(--error-color); margin-top: var(--spacing-sm);">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div class="confirm-footer">
          <button class="btn btn-secondary" @click="cancelDelete">Cancelar</button>
          <button class="btn btn-danger" @click="handleDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getUsuarios, deleteUsuario } from '../../services/usuariosService';
import UsuarioModal from './UsuarioModal.vue';
import UsuarioDetail from './UsuarioDetail.vue';
import '../../styles/usuarios.css';

export default {
  name: 'UsuariosList',
  components: {
    UsuarioModal,
    UsuarioDetail
  },
  setup() {
    const usuarios = ref([]);
    const searchTerm = ref('');
    const isLoading = ref(true);
    const showModal = ref(false);
    const selectedUsuario = ref(null);
    const showDetail = ref(false);
    const selectedUsuarioId = ref(null);
    const showConfirmDelete = ref(false);
    const userToDelete = ref(null);

    const filteredUsuarios = computed(() => {
      if (!searchTerm.value) return usuarios.value;
      
      const search = searchTerm.value.toLowerCase();
      return usuarios.value.filter(u =>
        u.nombres.toLowerCase().includes(search) ||
        u.apellidos.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.dni.includes(search) ||
        u.ciudad.toLowerCase().includes(search)
      );
    });

    const stats = computed(() => ({
      total: usuarios.value.length,
      masculino: usuarios.value.filter(u => u.genero === 'masculino').length,
      femenino: usuarios.value.filter(u => u.genero === 'femenino').length
    }));

    const fetchUsuarios = async () => {
      isLoading.value = true;
      try {
        const response = await getUsuarios();
        if (response.success) {
          usuarios.value = response.data;
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const openModal = (usuario = null) => {
      selectedUsuario.value = usuario;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedUsuario.value = null;
    };

    const viewDetail = (usuario) => {
      selectedUsuarioId.value = usuario.id;
      showDetail.value = true;
    };

    const closeDetail = () => {
      showDetail.value = false;
      selectedUsuarioId.value = null;
    };

    const handleSuccess = () => {
      fetchUsuarios();
      closeModal();
    };

    const confirmDelete = (usuario) => {
      userToDelete.value = usuario;
      showConfirmDelete.value = true;
    };

    const cancelDelete = () => {
      showConfirmDelete.value = false;
      userToDelete.value = null;
    };

    const handleDelete = async () => {
      try {
        await deleteUsuario(userToDelete.value.id);
        await fetchUsuarios();
        cancelDelete();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
      }
    };

    const getInitials = (nombres, apellidos) => {
      return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase();
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(() => {
      fetchUsuarios();
    });

    return {
      usuarios,
      searchTerm,
      isLoading,
      showModal,
      selectedUsuario,
      showDetail,
      selectedUsuarioId,
      showConfirmDelete,
      userToDelete,
      filteredUsuarios,
      stats,
      openModal,
      closeModal,
      viewDetail,
      closeDetail,
      handleSuccess,
      confirmDelete,
      cancelDelete,
      handleDelete,
      getInitials,
      formatDate
    };
  }
};
</script>