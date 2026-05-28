# NovaPay — Backend API
 
> API REST del sistema de detección y gestión de fraude financiero **Sentinel NovaPay**.  
> Construida con **Node.js + Express + Sequelize** y desplegada en **Render**.
 
---
 
## Despliegue
 
| Entorno | URL |
|--------|-----|
| **Producción (Render)** | [https://novapay-backend-3p3z.onrender.com](https://novapay-backend-3p3z.onrender.com) |
| **Base de datos** | PostgreSQL en **Supabase** |
 
---
 
## Descripción general
 
El backend actúa como intermediario entre el frontend y el servicio de Data Science (DS). Sus responsabilidades son:
 
- Autenticar a los analistas mediante JWT con cookies seguras.
- Persistir transacciones, decisiones y perfiles de clientes en PostgreSQL (Supabase).
- Consultar la cola de fraude y enviar/recibir decisiones al microservicio DS.
- Calcular estadísticas del dashboard en tiempo real.
- Proveer fallback propio desde Supabase cuando el servicio DS no está disponible.
---
 
## Estructura del proyecto
 
```
back/
├── app.js                         # Punto de entrada, configuración de Express
├── package.json
└── src/
    ├── config/
    │   └── database.js            # Conexión a PostgreSQL con Sequelize
    ├── controllers/
    │   ├── auth.controller.js     # Login, logout, /me, actualizar perfil
    │   ├── client.controller.js   # Perfil de cliente con historial
    │   ├── decision.controller.js # Crear y listar decisiones de analistas
    │   ├── fraud.controller.js    # Decide, challenge, feedback, preview, explain
    │   ├── stats.controller.js    # Estadísticas dashboard y DS
    │   └── transaction.controller.js # Cola de transacciones pendientes
    ├── middlewares/
    │   └── auth.middleware.js     # Verificación JWT (cookie o Bearer header)
    ├── models/
    │   ├── analyst.model.js       # Modelo Analista (UUID, name, email, role, avatar)
    │   ├── analystDecision.model.js # Decisiones de analista (fraud / legitimate)
    │   ├── clientProfile.model.js # Perfil de riesgo de cliente
    │   ├── transaction.model.js   # Transacciones (amount, type, risk_level, decision…)
    │   └── index.js               # Asociaciones entre modelos
    ├── routes/
    │   ├── auth.routes.js
    │   ├── client.routes.js
    │   ├── decision.routes.js
    │   ├── fraud.routes.js
    │   ├── stats.routes.js
    │   └── transaction.routes.js
    ├── seeders/
    │   └── analyst.seeder.js      # Crea el analista por defecto al arrancar
    ├── services/
    │   └── fraud.service.js       # Llamadas al microservicio DS
    └── utils/
        ├── dsApi.js               # Instancia Axios hacia el DS
        └── jwt.js                 # Generación de access tokens (8 h)
```
 
---
 
## Endpoints de la API
 
> Base URL: `https://novapay-backend-3p3z.onrender.com`  
> Todas las rutas protegidas requieren el header `Authorization: Bearer <token>` o la cookie `accessToken`.
 
### Auth — `/api/auth`
 
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `POST` | `/api/auth/login` | ❌ | Inicia sesión. Devuelve token JWT + cookie `accessToken` |
| `GET` | `/api/auth/me` | ✅ | Devuelve los datos del analista autenticado |
| `POST` | `/api/auth/logout` | ✅ | Cierra sesión y elimina la cookie |
| `PATCH` | `/api/auth/profile` | ✅ | Actualiza el estilo de avatar del analista |
 
> El endpoint `/api/auth/login` tiene rate limiting: máximo **20 peticiones cada 15 minutos**.
 
---
 
### Transacciones — `/api/transactions`
 
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `GET` | `/api/transactions` | ✅ | Devuelve la cola de transacciones pendientes. Acepta query params: `limit`, `offset`, `type`, `risk_level` |
 
---
 
### Decisiones — `/api/decisions`
 
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `GET` | `/api/decisions` | ✅ | Lista todas las decisiones. Filtros: `verdict`, `dateFrom`, `dateTo` |
| `POST` | `/api/decisions` | ✅ | Registra la decisión de un analista (`fraud` / `legitimate`) y envía feedback al DS |
 
---
 
### Fraude (Data Science) — `/api/fraud`
 
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `POST` | `/api/fraud/decide` | ✅ | Envía una transacción al modelo DS y devuelve `decision`, `fraud_probability`, `risk_level` |
| `POST` | `/api/fraud/challenge` | ✅ | Obtiene recomendación de fricción adaptativa para la transacción |
| `POST` | `/api/fraud/feedback` | ✅ | Reenvía feedback del analista al modelo DS |
| `POST` | `/api/fraud/preview` | ✅ | Simulador de umbral what-if: previsualiza el impacto de cambiar el threshold |
| `GET` | `/api/fraud/explain/:transaction_id` | ✅ | Explicación narrativa de la decisión del modelo para una transacción |
 
---
 
### Estadísticas — `/api/stats`
 
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `GET` | `/api/stats` | ✅ | KPIs del dashboard: total transacciones, hoy, pendientes, bloqueadas, tasa de detección |
| `GET` | `/api/stats/ds` | ✅ | Estadísticas globales del servicio DS (con fallback a Supabase) |
| `GET` | `/api/stats/history` | ✅ | Historial de decisiones: aprobadas, bloqueadas, flags manuales |
 
---
 
### Clientes — `/api/clients`
 
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `GET` | `/api/clients/:nameOrig` | ✅ | Perfil completo del cliente: stats, transacciones recientes, flags de riesgo. Acepta `limit`, `offset` |
 
---
 
## Modelos de base de datos
 
### `Analyst`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Clave primaria |
| `name` | STRING | Nombre del analista |
| `email` | STRING | Email único |
| `password` | STRING | Hash bcrypt |
| `role` | ENUM | `analyst` / `admin` |
| `avatar_style` | STRING | Estilo DiceBear del avatar |
 
### `Transaction`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `transaction_id` | STRING | Clave primaria |
| `step` | INTEGER | Paso temporal de la simulación |
| `amount` | FLOAT | Importe de la transacción |
| `type` | ENUM | `TRANSFER`, `CASH_OUT`, `PAYMENT`, `DEBIT`, `CASH_IN` |
| `nameOrig` / `nameDest` | STRING | Identificadores de origen y destino |
| `fraud_probability` | FLOAT | Probabilidad de fraude (0-1) |
| `risk_level` | ENUM | `low` / `medium` / `high` |
| `decision` | ENUM | `allow` / `review` / `block` |
| `status` | ENUM | `pending` / `reviewed` |
 
### `AnalystDecision`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Clave primaria |
| `transaction_id` | STRING | FK → Transaction |
| `verdict` | ENUM | `fraud` / `legitimate` |
| `notes` | TEXT | Notas del analista (opcional) |
| `analyst_id` | UUID | FK → Analyst |
 
---
 
## Seguridad
 
- **Helmet** para cabeceras HTTP seguras.
- **CORS** restringido al origen del frontend.
- **JWT** con expiración de 8 horas, almacenado en cookie `httpOnly + secure + sameSite: none`.
- **Rate limiting** en `/api/auth/login`: 20 intentos / 15 min.
- **bcrypt** para hash de contraseñas.
---
 
## Instalación y ejecución local
 
### Requisitos previos
 
- Node.js 18+
- PostgreSQL (o acceso a la instancia de Supabase)
### 1. Clonar el repositorio
 
```bash
git clone https://github.com/Elegm92/novapay-backend.git
cd novapay-backend
```
 
### 2. Instalar dependencias
 
```bash
npm install
```
 
### 3. Configurar variables de entorno
 
Crea un archivo `.env` en la raíz con el siguiente contenido:
 
```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_bd
JWT_SECRET=tu_secreto_jwt
FRONTEND_URL=http://localhost:5173
DS_API_URL=https://url-del-servicio-ds
```
 
### 4. Arrancar en desarrollo
 
```bash
npm run dev
```
 
### 5. Arrancar en producción
 
```bash
npm start
```
 
Al arrancar, la aplicación:
1. Conecta con PostgreSQL y sincroniza los modelos.
2. Ejecuta el seeder que crea el analista por defecto:
   - **Email:** `analyst@novapay.com`
   - **Contraseña:** `1234`
---
 
## Stack tecnológico
 
| Paquete | Versión | Uso |
|---------|---------|-----|
| Express | ^5.2 | Framework HTTP |
| Sequelize | ^6.37 | ORM PostgreSQL |
| pg | ^8.21 | Driver PostgreSQL |
| jsonwebtoken | ^9.0 | Autenticación JWT |
| bcryptjs | ^3.0 | Hash de contraseñas |
| helmet | ^8.2 | Cabeceras de seguridad |
| cors | ^2.8 | Control de origen |
| express-rate-limit | ^8.5 | Rate limiting |
| cookie-parser | ^1.4 | Lectura de cookies |
| axios | ^1.16 | Llamadas al servicio DS |
| dotenv | ^17.4 | Variables de entorno |
 
---
 
## Despliegue en Render
 
El backend está desplegado como **Web Service** en [Render](https://render.com):
 
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Variables de entorno:** configuradas en el panel de Render
- **Auto-deploy:** activado desde la rama `main` del repositorio
>  Render suspende el servicio por inactividad en el plan gratuito. La primera petición puede tardar ~30 segundos en "despertar" el servidor.
 
---
## Hecho por
- Elena González 
- Karina Paola Rojas
