# 🚀 Inicio Rápido - Cambio de Entorno

## Cambiar entre LOCAL y PRODUCCIÓN

### Opción 1: Editar .env manualmente
Abre `backend/server/.env` y cambia:

```env
# Para LOCAL
NODE_ENV=development

# Para PRODUCCIÓN
NODE_ENV=production
```

### Opción 2: Usar scripts NPM
```bash
cd backend/server

# Cambiar a LOCAL
npm run env:dev

# Cambiar a PRODUCCIÓN
npm run env:prod

# Ver estado actual
npm run env:status
```

## Iniciar el servidor
```bash
cd backend/server
npm run dev
```

## Verificar configuración
Al iniciar, verás algo como:

```
============================================================
🚀 SERVER STARTED SUCCESSFULLY
============================================================
📦 Environment: DEVELOPMENT
🌐 Port: 3001
🔗 Client URL: http://localhost:5173
💾 Storage Mode: LOCAL
🗄️  Database: file:./prisma/dev.db
============================================================
```

## Frontend
El frontend NO necesita cambios, solo asegúrate que `frontend/.env` tenga:

```env
# Para LOCAL
VITE_API_URL=http://localhost:3001/api

# Para PRODUCCIÓN
VITE_API_URL=http://54.81.191.206:3000/api
```

---

**¡Eso es todo!** 🎉 Solo cambia `NODE_ENV` y reinicia el servidor.

📚 Para más detalles ver: [README-ENVIRONMENT.md](./README-ENVIRONMENT.md)
