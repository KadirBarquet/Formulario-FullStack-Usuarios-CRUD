<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-drawer" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          <span>{{ isEditing ? '✏️' : '➕' }}</span>
          {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h2>
        <button class="modal-close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div v-if="errorMessage" class="alert alert-error">
          ⚠️ {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- DNI -->
          <div class="form-group">
            <label for="modal-dni" class="form-label required">DNI / Cédula</label>
            <input
              id="modal-dni"
              v-model="formData.dni"
              type="text"
              class="form-input"
              :class="{ error: errors.dni }"
              placeholder="0123456789"
              maxlength="10"
              @blur="validateField('dni')"
            />
            <span v-if="errors.dni" class="form-error">{{ errors.dni }}</span>
          </div>

          <!-- Nombres y Apellidos -->
          <div class="form-row">
            <div class="form-group">
              <label for="modal-nombres" class="form-label required">Nombres</label>
              <input
                id="modal-nombres"
                v-model="formData.nombres"
                type="text"
                class="form-input"
                :class="{ error: errors.nombres }"
                placeholder="Juan Carlos"
                @blur="validateField('nombres')"
              />
              <span v-if="errors.nombres" class="form-error">{{ errors.nombres }}</span>
            </div>

            <div class="form-group">
              <label for="modal-apellidos" class="form-label required">Apellidos</label>
              <input
                id="modal-apellidos"
                v-model="formData.apellidos"
                type="text"
                class="form-input"
                :class="{ error: errors.apellidos }"
                placeholder="Pérez González"
                @blur="validateField('apellidos')"
              />
              <span v-if="errors.apellidos" class="form-error">{{ errors.apellidos }}</span>
            </div>
          </div>

          <!-- Fecha -->
          <div class="form-group">
            <label for="modal-fecha" class="form-label required">Fecha de Nacimiento</label>
            <input
              id="modal-fecha"
              v-model="formData.fecha_nacimiento"
              type="date"
              class="form-input"
              :class="{ error: errors.fecha_nacimiento }"
              @blur="validateField('fecha_nacimiento')"
            />
            <span v-if="errors.fecha_nacimiento" class="form-error">{{ errors.fecha_nacimiento }}</span>
          </div>

          <!-- Género -->
          <div class="form-group">
            <label class="form-label required">Género</label>
            <div class="gender-toggle-group">
              <div v-for="genero in GENEROS" :key="genero.value" class="gender-toggle-option">
                <input
                  :id="`modal-genero-${genero.value}`"
                  v-model="formData.genero"
                  type="radio"
                  :value="genero.value"
                  @change="validateField('genero')"
                />
                <label :for="`modal-genero-${genero.value}`" class="gender-toggle-label">
                  <span>{{ genero.icon }}</span>
                  <span>{{ genero.label }}</span>
                </label>
              </div>
            </div>
            <span v-if="errors.genero" class="form-error">{{ errors.genero }}</span>
          </div>

          <!-- Ciudad -->
          <div class="form-group">
            <label for="modal-ciudad" class="form-label required">Ciudad</label>
            <select
              id="modal-ciudad"
              v-model="formData.ciudad"
              class="form-select"
              :class="{ error: errors.ciudad }"
              @blur="validateField('ciudad')"
            >
              <option value="">Selecciona una ciudad</option>
              <option v-for="ciudad in CIUDADES_ECUADOR" :key="ciudad" :value="ciudad">
                {{ ciudad }}
              </option>
            </select>
            <span v-if="errors.ciudad" class="form-error">{{ errors.ciudad }}</span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="modal-email" class="form-label required">Email</label>
            <input
              id="modal-email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :class="{ error: errors.email }"
              placeholder="usuario@email.com"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="modal-password" :class="['form-label', { required: !isEditing }]">
              Contraseña {{ isEditing ? '(dejar vacío para no cambiar)' : '' }}
            </label>
            <div class="password-wrapper">
              <input
                id="modal-password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.password }"
                :placeholder="isEditing ? 'Nueva contraseña (opcional)' : '••••••••'"
                @blur="validateField('password')"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')" :disabled="isLoading">
          Cancelar
        </button>
        <button class="btn btn-primary" @click="handleSubmit" :disabled="isLoading">
          {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import { createUsuario, updateUsuario } from '../../services/usuariosService';
import { VALIDATION_MESSAGES, CIUDADES_ECUADOR, GENEROS } from '../../utils/constants';

export default {
  name: 'UsuarioModal',
  props: {
    usuario: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const isEditing = computed(() => !!props.usuario);
    const formData = reactive({
      dni: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      genero: '',
      ciudad: '',
      email: '',
      password: ''
    });
    const errors = reactive({});
    const errorMessage = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);

    // Cargar datos si es edición
    watch(() => props.usuario, (newVal) => {
      if (newVal) {
        Object.assign(formData, {
          ...newVal,
          fecha_nacimiento: newVal.fecha_nacimiento?.split('T')[0],
          password: ''
        });
      }
    }, { immediate: true });

    const validateField = (field) => {
      errors[field] = '';

      switch(field) {
        case 'dni':
          if (!formData.dni) {
            errors.dni = VALIDATION_MESSAGES.REQUIRED;
          } else if (!/^\d{10}$/.test(formData.dni)) {
            errors.dni = VALIDATION_MESSAGES.DNI_INVALID;
          }
          break;
        
        case 'nombres':
        case 'apellidos':
          if (!formData[field]) {
            errors[field] = VALIDATION_MESSAGES.REQUIRED;
          } else if (formData[field].length < 2) {
            errors[field] = VALIDATION_MESSAGES.NAMES_MIN;
          }
          break;
        
        case 'fecha_nacimiento':
          if (!formData.fecha_nacimiento) {
            errors.fecha_nacimiento = VALIDATION_MESSAGES.REQUIRED;
          } else {
            const today = new Date();
            const birth = new Date(formData.fecha_nacimiento);
            const age = today.getFullYear() - birth.getFullYear();
            
            if (birth > today) {
              errors.fecha_nacimiento = VALIDATION_MESSAGES.DATE_FUTURE;
            } else if (age < 18) {
              errors.fecha_nacimiento = VALIDATION_MESSAGES.AGE_MIN;
            }
          }
          break;
        
        case 'genero':
        case 'ciudad':
          if (!formData[field]) {
            errors[field] = VALIDATION_MESSAGES.REQUIRED;
          }
          break;
        
        case 'email':
          if (!formData.email) {
            errors.email = VALIDATION_MESSAGES.REQUIRED;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
          }
          break;
        
        case 'password':
          if (!isEditing.value && !formData.password) {
            errors.password = VALIDATION_MESSAGES.REQUIRED;
          } else if (formData.password && formData.password.length < 6) {
            errors.password = VALIDATION_MESSAGES.PASSWORD_MIN;
          }
          break;
      }
    };

    const validateAll = () => {
      Object.keys(formData).forEach(validateField);
      return Object.values(errors).every(error => !error);
    };

    const handleSubmit = async () => {
      if (!validateAll()) return;

      isLoading.value = true;
      errorMessage.value = '';

      try {
        const data = { ...formData };
        if (isEditing.value && !data.password) {
          delete data.password;
        }

        let response;
        if (isEditing.value) {
          response = await updateUsuario(props.usuario.id, data);
        } else {
          response = await createUsuario(data);
        }

        if (response.success) {
          emit('success');
        }
      } catch (error) {
        errorMessage.value = error.message || 'Error al guardar usuario';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isEditing,
      formData,
      errors,
      errorMessage,
      isLoading,
      showPassword,
      CIUDADES_ECUADOR,
      GENEROS,
      validateField,
      handleSubmit
    };
  }
};
</script>