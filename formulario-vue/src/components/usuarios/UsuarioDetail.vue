<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="detail-modal" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          <span>👤</span>
          Detalle de Usuario
        </h2>
        <button class="modal-close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="modal-body">
        <div class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">Cargando información...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="modal-body">
        <div class="alert alert-error">
          ⚠️ {{ error }}
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="usuario" class="modal-body">
        <!-- Avatar y nombre -->
        <div class="detail-header">
          <div class="detail-avatar">
            {{ getInitials(usuario.nombres, usuario.apellidos) }}
          </div>
          <div class="detail-name">
            <h3>{{ usuario.nombres }} {{ usuario.apellidos }}</h3>
            <p>{{ usuario.email }}</p>
          </div>
        </div>

        <!-- Información detallada -->
        <div class="detail-info-grid">
          <div class="detail-info-card">
            <div class="detail-info-icon">🆔</div>
            <div class="detail-info-content">
              <span class="detail-info-label">DNI / Cédula</span>
              <span class="detail-info-value">{{ usuario.dni }}</span>
            </div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-icon">📅</div>
            <div class="detail-info-content">
              <span class="detail-info-label">Fecha de Nacimiento</span>
              <span class="detail-info-value">{{ formatFullDate(usuario.fecha_nacimiento) }}</span>
              <span class="detail-info-extra">{{ calculateAge(usuario.fecha_nacimiento) }} años</span>
            </div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-icon">{{ usuario.genero === 'masculino' ? '👨' : '👩' }}</div>
            <div class="detail-info-content">
              <span class="detail-info-label">Género</span>
              <span class="detail-info-value">{{ usuario.genero }}</span>
            </div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-icon">📍</div>
            <div class="detail-info-content">
              <span class="detail-info-label">Ciudad</span>
              <span class="detail-info-value">{{ usuario.ciudad }}</span>
            </div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-icon">📧</div>
            <div class="detail-info-content">
              <span class="detail-info-label">Email</span>
              <span class="detail-info-value">{{ usuario.email }}</span>
            </div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-icon">🕒</div>
            <div class="detail-info-content">
              <span class="detail-info-label">Registro</span>
              <span class="detail-info-value">{{ formatFullDate(usuario.created_at) }}</span>
            </div>
          </div>

          <div v-if="usuario.updated_at" class="detail-info-card">
            <div class="detail-info-icon">🔄</div>
            <div class="detail-info-content">
              <span class="detail-info-label">Última Actualización</span>
              <span class="detail-info-value">{{ formatFullDate(usuario.updated_at) }}</span>
            </div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-icon">#️⃣</div>
            <div class="detail-info-content">
              <span class="detail-info-label">ID del Sistema</span>
              <span class="detail-info-value">{{ usuario.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUsuarioById } from '../../services/usuariosService';

export default {
  name: 'UsuarioDetail',
  props: {
    usuarioId: {
      type: Number,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const usuario = ref(null);
    const isLoading = ref(true);
    const error = ref('');

    const fetchUsuario = async () => {
      isLoading.value = true;
      error.value = '';
      
      try {
        const response = await getUsuarioById(props.usuarioId);
        if (response.success) {
          usuario.value = response.data;
        }
      } catch (err) {
        error.value = err.message || 'Error al cargar el usuario';
      } finally {
        isLoading.value = false;
      }
    };

    const getInitials = (nombres, apellidos) => {
      return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase();
    };

    const formatFullDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-EC', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

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

    onMounted(() => {
      fetchUsuario();
    });

    return {
      usuario,
      isLoading,
      error,
      getInitials,
      formatFullDate,
      calculateAge
    };
  }
};
</script>

<style scoped>
.detail-modal {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 700px;
  background-color: var(--white);
  box-shadow: var(--shadow-xl);
  animation: slideInRight 0.3s ease-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--white);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  box-shadow: var(--shadow-lg);
  flex-shrink: 0;
}

.detail-name h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.detail-name p {
  font-size: 1rem;
  opacity: 0.9;
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.detail-info-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary-color);
  transition: all var(--transition-base);
}

.detail-info-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.detail-info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.detail-info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.detail-info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  text-transform: capitalize;
}

.detail-info-extra {
  font-size: 0.875rem;
  color: var(--gray-600);
}

@media (max-width: 768px) {
  .detail-modal {
    max-width: 100%;
  }
  
  .detail-info-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-avatar {
    width: 70px;
    height: 70px;
    font-size: 1.75rem;
  }
}
</style>