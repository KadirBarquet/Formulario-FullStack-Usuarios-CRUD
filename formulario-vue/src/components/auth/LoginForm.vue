<template>
  <div class="auth-form-container">
    <div class="auth-form-header">
      <h1 class="auth-form-title">Iniciar Sesión</h1>
      <p class="auth-form-subtitle">Ingresa tus credenciales para acceder</p>
    </div>

    <div v-if="errorMessage" class="alert alert-error">
      ⚠️ {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label required">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ error: errors.email }"
          placeholder="tu@email.com"
          @blur="validateField('email')"
        />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password" class="form-label required">Contraseña</label>
        <div class="password-wrapper">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            :class="{ error: errors.password }"
            placeholder="••••••••"
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

      <!-- Submit -->
      <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="isLoading">
        {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>

    <div class="auth-form-link">
      ¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../services/usuariosService';
import { VALIDATION_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter();
    const formData = reactive({
      email: '',
      password: ''
    });
    const errors = reactive({});
    const errorMessage = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);

    const validateField = (field) => {
      errors[field] = '';

      if (field === 'email') {
        if (!formData.email) {
          errors.email = VALIDATION_MESSAGES.REQUIRED;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
        }
      }

      if (field === 'password') {
        if (!formData.password) {
          errors.password = VALIDATION_MESSAGES.REQUIRED;
        } else if (formData.password.length < 6) {
          errors.password = VALIDATION_MESSAGES.PASSWORD_MIN;
        }
      }
    };

    const validateAll = () => {
      validateField('email');
      validateField('password');
      return !errors.email && !errors.password;
    };

    const handleSubmit = async () => {
      if (!validateAll()) return;

      isLoading.value = true;
      errorMessage.value = '';

      try {
        const response = await login(formData.email, formData.password);
        
        if (response.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          router.push('/dashboard');
        }
      } catch (error) {
        errorMessage.value = error.message || ERROR_MESSAGES.LOGIN_FAILED;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      errors,
      errorMessage,
      isLoading,
      showPassword,
      validateField,
      handleSubmit
    };
  }
};
</script>


