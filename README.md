# 🌐 ConnectMe

**ConnectMe** es una red social minimalista desarrollada como Trabajo de Fin de Grado. Permite a los usuarios registrarse, publicar contenido, dar like, comentar y seguir a otros usuarios. El proyecto está construido con una arquitectura fullstack moderna: **React** para el frontend, **Laravel** para el backend y **Sanctum** para la autenticación basada en cookies.

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend
- React + Vite
- TailwindCSS
- Axios
- React Router DOM
- SweetAlert2

### 🔧 Backend
- Laravel 10
- Sanctum (autenticación para SPA)
- MySQL

---

## ✨ Funcionalidades principales

- Registro e inicio de sesión (con cookies, usando Sanctum)
- Creación y visualización de publicaciones con imagen y texto
- Likes en publicaciones
- Comentarios con carga paginada
- Seguimiento entre usuarios (follow/unfollow)
- Perfiles individuales (`/profile/:id`)
- Feed de publicaciones personalizadas
- Chat privado en tiempo real con WebSockets
- Sistema de notificaciones en tiempo real
- SPA con configuración completa de CORS y sesiones

---

## ⚙️ Instalación local

### Requisitos

- Node.js y npm
- PHP ≥ 8.1
- Composer
- MySQL
- WAMP/XAMPP o similar

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/connectme.git
```

### 2. Configurar el backend (Laravel)

```bash
cd connectme/backend
composer install
cp .env.example .env
```

Configura la base de datos en el archivo `.env`, crea una base de datos llamada `connectme` y luego ejecuta:

```bash
php artisan key:generate
php artisan serve
```

### 3. Configurar el frontend (React)

```bash
cd ../frontend
npm install
npm run dev
```

### 4. WebSocket (opcional)

Para activar el chat privado en tiempo real:

```bash
node socket-server.cjs
```

---

## 📌 Notas

- Asegúrate de que el frontend y el backend estén ejecutándose al mismo tiempo.
- Sanctum se encarga de la autenticación usando cookies seguras, lo que requiere que las URLs compartan dominio o se configure un proxy para desarrollo.
- El sistema ha sido diseñado para ofrecer una experiencia fluida, rápida y respetuosa con la privacidad del usuario.

---

## ✅ TODO

- [x] Autenticación con Laravel Sanctum
- [x] Registro y login de usuarios
- [x] Creación de publicaciones con imagen y texto
- [x] Likes y comentarios con paginación
- [x] Sistema de seguimiento entre usuarios
- [x] Perfiles individuales públicos
- [x] Feed personalizado según usuarios seguidos
- [x] Notificaciones en tiempo real
- [x] Chat privado en tiempo real (WebSockets)
- [ ] Subida de archivos en mensajes
- [ ] Conversión a PWA para instalación en móviles
- [ ] Página de configuración del usuario
- [ ] Soporte para eliminación de cuenta
- [ ] Rediseño móvil completo del chat
