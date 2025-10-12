# Sistema de Gestión de Usuarios

Aplicación fullstack para gestión de usuarios con backend en Node.js/Express y dos frontends diferentes (React y Vue) conectados a PostgreSQL.

## Descripción

Este proyecto implementa un sistema completo de gestión de usuarios con autenticación básica, validaciones en tiempo real y operaciones CRUD. El proyecto está dividido en tres partes:

- **Backend**: API REST con Node.js, Express y PostgreSQL
- **Frontend React**: Interfaz con diseño moderno usando React, Vite y CSS puro
- **Frontend Vue**: Interfaz alternativa con diseño diferente usando Vue 3, Vite y CSS puro

## Estructura del Repositorio

```
/
├── backend-express/          # Backend Node.js + Express
├── formulario-react/          # Frontend React + Vite
├── formulario-vue/            # Frontend Vue 3 + Vite
└── README.md                  # Este archivo
```

## Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- PostgreSQL (v12 o superior)

## Instalación

### 1. Backend (Express)

```bash
cd backend-express

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Configurar variables de entorno
# DB_USER=postgres
# DB_PASSWORD=tu_password
# DB_NAME=formulario_usuarios
# DB_HOST=localhost
# DB_PORT=5432
# PORT=5000
```

### 2. Frontend React

```bash
cd formulario-react

# Instalar dependencias
npm install
```

### 3. Frontend Vue

```bash
cd formulario-vue

# Instalar dependencias
npm install
```

## Configuración de Base de Datos

### Crear base de datos en PostgreSQL

```sql
-- Conectarse a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE formulario_usuarios;

-- Conectar a la base de datos
\c formulario_usuarios

-- Crear tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('masculino', 'femenino')),
    ciudad VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Ejecución

### Ejecutar Backend

```bash
cd backend-express
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Ejecutar Frontend React

```bash
cd formulario-react
npm run dev
```

Accede a `http://localhost:5173`

### Ejecutar Frontend Vue

```bash
cd formulario-vue
npm run dev
```

Accede a `http://localhost:5174` (o el puerto indicado por Vite)

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios (CRUD)

- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

## Funcionalidades

### Backend

- Validaciones de datos en el servidor
- Gestión de errores centralizada
- Conexión segura a PostgreSQL
- CORS habilitado
- Respuestas JSON estructuradas

### Frontend React

- Página de Login y Registro
- Dashboard con lista de usuarios
- CRUD completo (crear, leer, actualizar, eliminar)
- Búsqueda en tiempo real
- Validaciones con React Hook Form + Yup
- Estadísticas de usuarios
- CSS puro con animaciones
- Diseño responsive
- Paleta de colores morado/violeta

### Frontend Vue

- Página de Login y Registro con layout split-screen
- Dashboard con tabla/cards de usuarios
- Modal drawer para crear/editar usuarios
- Modal de detalle con GET /api/usuarios/:id
- Búsqueda con filtrado dinámico
- Validaciones con Vue reactivity
- CSS puro con animaciones
- Diseño responsive (tabla desktop, cards mobile)
- Paleta de colores azul/verde/teal

## Diferencias de Diseño

### React
- Fondo degradado morado
- Card centralizados
- Grid de 3 columnas para usuarios
- Radio buttons para género
- Modal centrado

### Vue
- Layout split-screen (imagen + formulario)
- Tabla de usuarios en desktop
- Cards apilados en mobile
- Toggle buttons para género con iconos
- Modal drawer desde la derecha

## Seguridad

**Nota importante**: Este proyecto NO incluye:
- Autenticación JWT (es una versión simplificada)
- Hasheo de contraseñas (se guardan en texto plano para demostración)

Para producción, implementar:
- JWT para autenticación
- bcryptjs para hasheo de contraseñas
- HTTPS
- Rate limiting
- Validación CSRF

## Responsive Design

Ambos frontends son completamente responsive:
- Desktop: Vista completa con todas las características
- Tablet: Adaptación de layouts
- Mobile: Interfaces simplificadas y optimizadas

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- Axios (en clientes)
- CORS

### Frontend React
- React 18
- Vite
- React Router
- React Hook Form
- Yup (validaciones)
- Axios

### Frontend Vue
- Vue 3
- Vite
- Vue Router
- Axios
- CSS puro

## Validaciones

### Frontend

**Registro:**
- DNI: 10 dígitos válidos según algoritmo ecuatoriano
- Nombres/Apellidos: mínimo 2 caracteres
- Fecha: mayor de 18 años
- Email: formato válido
- Contraseña: mínimo 6 caracteres

**Login:**
- Email y contraseña requeridos
- Credenciales válidas

### Backend

Las mismas validaciones se aplican en el servidor para mayor seguridad.

## Modelos de Datos

### Usuario

```javascript
{
  id: Number,
  dni: String (10 dígitos),
  nombres: String,
  apellidos: String,
  fecha_nacimiento: Date,
  genero: 'masculino' | 'femenino',
  ciudad: String,
  email: String (único),
  password: String,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## Deployment

### Backend
- Recomendado: Heroku, Railway, Render
- Variables de entorno en plataforma de hosting
- Base de datos en servicio administrado (AWS RDS, Supabase)

### Frontend
- Recomendado: Vercel, Netlify, GitHub Pages
- Build: `npm run build`
- Ambiente de producción: actualizar `API_URL` a la URL del backend

## Documentación Adicional

Consulta los README individuales en cada carpeta:
- `backend-express/README.md` - Documentación del backend
- `formulario-react/README.md` - Documentación de React
- `formulario-vue/README.md` - Documentación de Vue

## Contribuciones

Este es un proyecto educativo. Las contribuciones son bienvenidas.

## Licencia

MIT

## Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio.

---
