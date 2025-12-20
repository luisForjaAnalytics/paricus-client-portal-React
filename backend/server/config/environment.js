import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Determinar el entorno actual
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// ============================================
// CONFIGURACIÓN DEL ENTORNO (SOLO LOCAL)
// ============================================
const config = {
  // Entorno (siempre development)
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  isDevelopment,

  // Servidor
  port: process.env.PORT || '3001',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Base de datos
  databaseUrl: process.env.DATABASE_URL || 'file:./prisma/dev.db',

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // AWS S3 (opcional)
  aws: {
    region: process.env.AWS_REGION || 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  },

  // MSSQL (opcional)
  mssql: {
    server: process.env.MSSQL_SERVER,
    port: parseInt(process.env.MSSQL_PORT || '1433'),
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
  },

  // Seguridad
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '10000'),
    authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '1000'),
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
  },

  // Storage mode
  storageMode: process.env.STORAGE_MODE || 'local', // 'local' o 's3'
};

// Validar configuración crítica
function validateConfig() {
  const errors = [];

  if (!config.jwtSecret) {
    errors.push('JWT_SECRET no está configurado en el .env');
  }

  if (config.jwtSecret && config.jwtSecret.length < 32) {
    errors.push('JWT_SECRET debe tener al menos 32 caracteres');
  }

  if (config.storageMode === 's3' && !config.aws.accessKeyId) {
    errors.push('AWS_ACCESS_KEY_ID no está configurado y STORAGE_MODE es "s3"');
  }

  if (errors.length > 0) {
    console.error('❌ ERRORES DE CONFIGURACIÓN:');
    errors.forEach((error) => console.error(`   - ${error}`));
    throw new Error('Configuración inválida. Revisa el archivo .env');
  }

  console.log('✅ Configuración validada correctamente');
  console.log(`📦 Entorno: ${config.nodeEnv.toUpperCase()}`);
  console.log(`🚀 Puerto: ${config.port}`);
  console.log(`🌐 Cliente URL: ${config.clientUrl}`);
  console.log(`💾 Storage Mode: ${config.storageMode.toUpperCase()}`);
  console.log(`🗄️  Base de datos: ${config.databaseUrl}`);
}

// Validar al cargar el módulo
validateConfig();

export default config;
