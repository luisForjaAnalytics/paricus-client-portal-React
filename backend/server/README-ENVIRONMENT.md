# 🔧 Configuración de Entornos - Backend

Este documento explica cómo cambiar entre entorno LOCAL y PRODUCCIÓN en el backend.

## 📋 Cambio Rápido de Entorno

Para cambiar entre entorno local y producción, **solo necesitas editar una línea** en el archivo `.env`:

### ✅ Para trabajar en LOCAL (desarrollo):
```env
NODE_ENV=development
```

### ✅ Para trabajar en PRODUCCIÓN (AWS):
```env
NODE_ENV=production
```

## 🗂️ Estructura de Variables

El archivo `.env` tiene dos grupos de variables para cada configuración:

### Variables LOCALES (prefijo `LOCAL_`)
- `LOCAL_PORT` - Puerto del servidor local (default: 3001)
- `LOCAL_CLIENT_URL` - URLs del frontend local
- `LOCAL_DATABASE_URL` - Base de datos SQLite local
- `LOCAL_JWT_SECRET` - Secret JWT para desarrollo
- `LOCAL_AWS_*` - Credenciales AWS para desarrollo (opcional)
- `LOCAL_MSSQL_*` - Configuración MSSQL local (opcional)

### Variables PRODUCCIÓN (prefijo `PRODUCTION_`)
- `PRODUCTION_PORT` - Puerto del servidor en AWS (default: 3000)
- `PRODUCTION_CLIENT_URL` - URL del frontend en AWS
- `PRODUCTION_DATABASE_URL` - Base de datos SQLite en AWS
- `PRODUCTION_JWT_SECRET` - Secret JWT seguro para producción
- `PRODUCTION_AWS_*` - Credenciales AWS para producción
- `PRODUCTION_MSSQL_*` - Configuración MSSQL en Azure

## 🚀 Ejemplo de Configuración

### .env para Desarrollo Local
```env
NODE_ENV=development

# Puerto local
LOCAL_PORT=3001

# Frontend local
LOCAL_CLIENT_URL=http://localhost:5173,http://localhost:5174

# Base de datos local
LOCAL_DATABASE_URL=file:./prisma/dev.db

# JWT local
LOCAL_JWT_SECRET=dev-jwt-secret-minimum-32-chars-long-for-security-12345678

# AWS (opcional si usas storage local)
STORAGE_MODE=local
```

### .env para Producción AWS
```env
NODE_ENV=production

# Puerto en AWS
PRODUCTION_PORT=3000

# Frontend en AWS
PRODUCTION_CLIENT_URL=http://54.81.191.206:3000

# Base de datos producción
PRODUCTION_DATABASE_URL=file:./prisma/production.db

# JWT producción (CAMBIAR A SECRET SEGURO)
PRODUCTION_JWT_SECRET=tu-secret-super-seguro-de-produccion-min-32-caracteres

# AWS S3
STORAGE_MODE=s3
PRODUCTION_AWS_ACCESS_KEY_ID=tu_key_de_produccion
PRODUCTION_AWS_SECRET_ACCESS_KEY=tu_secret_de_produccion
PRODUCTION_S3_BUCKET_NAME=paricus-client-portal
```

## 🔄 Cómo Funciona

El sistema usa el archivo `config/environment.js` que:

1. Lee `NODE_ENV` del `.env`
2. Si `NODE_ENV=development` → Usa variables `LOCAL_*`
3. Si `NODE_ENV=production` → Usa variables `PRODUCTION_*`

### Validación Automática

Al iniciar el servidor, verás un mensaje como:

```
✅ Configuración validada correctamente
📦 Entorno: DEVELOPMENT
🚀 Puerto: 3001
🌐 Cliente URL: http://localhost:5173
💾 Storage Mode: LOCAL
🗄️  Base de datos: file:./prisma/dev.db
```

## ⚠️ Importante

### 1. JWT Secret
- **NUNCA** uses el mismo JWT secret en desarrollo y producción
- El JWT secret debe tener **mínimo 32 caracteres**
- Usa un generador de secrets para producción

### 2. Frontend NO se modifica
- El frontend NO necesita cambios
- Solo cambia la variable `VITE_API_URL` en el `.env` del frontend si es necesario

### 3. Storage Mode
- `STORAGE_MODE=local` - Usa almacenamiento local en lugar de S3 (desarrollo)
- `STORAGE_MODE=s3` - Usa AWS S3 (producción)

## 🧪 Pruebas

### Verificar configuración actual:
```bash
cd backend/server
npm run dev
```

El servidor mostrará la configuración activa al iniciar.

### Verificar conexión S3:
```
GET http://localhost:3001/api/s3-test
```

### Verificar health check:
```
GET http://localhost:3001/api/health
```

## 📝 Checklist antes de Producción

Antes de cambiar a `NODE_ENV=production`, asegúrate de:

- [ ] Configurar `PRODUCTION_JWT_SECRET` con un secret seguro (min 32 chars)
- [ ] Configurar credenciales AWS correctas (`PRODUCTION_AWS_*`)
- [ ] Configurar URL del frontend correcta (`PRODUCTION_CLIENT_URL`)
- [ ] Configurar MSSQL si es necesario (`PRODUCTION_MSSQL_*`)
- [ ] Cambiar `STORAGE_MODE=s3` si usas S3 en producción
- [ ] Verificar que el puerto esté correcto (`PRODUCTION_PORT`)

## 🆘 Troubleshooting

### Error: "JWT_SECRET no está configurado"
**Solución:** Asegúrate de tener configurado:
- `LOCAL_JWT_SECRET` si `NODE_ENV=development`
- `PRODUCTION_JWT_SECRET` si `NODE_ENV=production`

### Error: "S3 client not configured"
**Solución:**
1. Si estás en desarrollo, cambia `STORAGE_MODE=local`
2. Si estás en producción, configura las variables `PRODUCTION_AWS_*`

### CORS errors
**Solución:** Verifica que `LOCAL_CLIENT_URL` o `PRODUCTION_CLIENT_URL` incluya la URL de tu frontend

### No puedo conectar a MSSQL
**Solución:**
- En desarrollo: Configura `LOCAL_MSSQL_*` con tu servidor local
- En producción: Configura `PRODUCTION_MSSQL_*` con Azure
- Es opcional si no usas audio recordings

## 📚 Archivos Relacionados

- `backend/server/.env` - Configuración de variables
- `backend/server/.env.example` - Plantilla de ejemplo
- `backend/server/config/environment.js` - Lógica de selección de entorno
- `backend/server/index.js` - Servidor principal
- `frontend/.env` - Configuración del frontend

## 🔗 Variables del Frontend

El frontend solo necesita una variable en su `.env`:

### Para desarrollo local:
```env
VITE_API_URL=http://localhost:3001/api
```

### Para producción AWS:
```env
VITE_API_URL=http://54.81.191.206:3000/api
```

---

**Nota:** Solo necesitas cambiar `NODE_ENV` en el backend. El frontend apunta a la URL configurada en su propio `.env`.
