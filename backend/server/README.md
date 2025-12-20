# 🖥️ Backend Server - Paricus Client Portal

## 🚀 Inicio Rápido

### 1. Instalar dependencias (solo primera vez)
```bash
npm install
```

### 2. Generar cliente Prisma (solo primera vez)
```bash
npx prisma generate
```

### 3. Crear y poblar base de datos (solo primera vez)
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### 4. Iniciar servidor
```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3001**

---

## 🔑 Credenciales de Prueba

Después de ejecutar el seed, usa estas credenciales:

### BPO Administration (Acceso completo)
- **Email:** admin@paricus.com
- **Password:** admin123!

### Flex Mobile
- **Admin:** admin@flexmobile.com / flex123!
- **User:** user@flexmobile.com / flexuser123!

### IM Telecom
- **Admin:** admin@imtelecom.com / imtelecom123!
- **User:** user@imtelecom.com / imuser123!

### North American Local
- **Admin:** admin@northamericanlocal.com / northam123!
- **User:** user@northamericanlocal.com / naluser123!

---

## ⚙️ Configuración

El archivo `.env` ya está configurado para desarrollo local:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev-jwt-secret-minimum-32-chars-long-for-local-development-12345678
STORAGE_MODE=local
```

**⚠️ IMPORTANTE:** El backend siempre trabaja en LOCAL. No cambiar `NODE_ENV`.

---

## 📁 Estructura

```
backend/server/
├── config/           # Configuración del entorno
├── database/         # Conexión Prisma
├── middleware/       # Auth, validación, cache
├── prisma/          # Schema y migrations
├── routes/          # Endpoints de la API
├── services/        # S3, MSSQL, logger
├── .env             # Variables de entorno
└── index.js         # Servidor principal
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor

# Base de datos
npx prisma generate      # Generar cliente Prisma
npx prisma migrate dev   # Crear migración
node prisma/seed.js      # Poblar con datos de prueba
npx prisma studio        # Abrir interfaz visual de DB

# Producción
npm start                # Iniciar servidor
```

---

## 🐛 Solución de Problemas

### Error: "Prisma Client did not initialize"
```bash
npx prisma generate
```

### Error: "Unable to open the database file"
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### Puerto 3001 en uso
Cambia `PORT` en `.env` o cierra la aplicación que usa el puerto.

---

## 📚 Documentación

- [COMO-CAMBIAR-ENTORNO.md](../../COMO-CAMBIAR-ENTORNO.md) - Guía de configuración
- [.env](./.env) - Variables de entorno

---

## 🔒 Seguridad

- JWT con expiración de 24h
- Bcrypt para passwords (12 rounds)
- Rate limiting en endpoints
- Helmet para headers de seguridad
- CORS configurado para localhost

---

**Nota:** Este servidor está configurado para desarrollo local. Para producción, usar el servidor en AWS.
