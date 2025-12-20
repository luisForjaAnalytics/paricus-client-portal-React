#!/usr/bin/env node

/**
 * Script para cambiar el entorno entre development y production
 *
 * Uso:
 *   node scripts/switch-env.js dev      # Cambiar a development
 *   node scripts/switch-env.js prod     # Cambiar a production
 *   node scripts/switch-env.js status   # Ver entorno actual
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV_FILE = path.join(__dirname, '../.env');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentEnvironment() {
  if (!fs.existsSync(ENV_FILE)) {
    log('❌ Archivo .env no encontrado', 'red');
    return null;
  }

  const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
  const match = envContent.match(/NODE_ENV\s*=\s*(\w+)/);

  if (!match) {
    log('⚠️  Variable NODE_ENV no encontrada en .env', 'yellow');
    return null;
  }

  return match[1];
}

function setEnvironment(env) {
  if (!fs.existsSync(ENV_FILE)) {
    log('❌ Archivo .env no encontrado', 'red');
    log('   Copia .env.example a .env primero', 'yellow');
    process.exit(1);
  }

  let envContent = fs.readFileSync(ENV_FILE, 'utf-8');

  // Reemplazar NODE_ENV
  const newContent = envContent.replace(
    /NODE_ENV\s*=\s*\w+/,
    `NODE_ENV=${env}`
  );

  fs.writeFileSync(ENV_FILE, newContent, 'utf-8');

  log('\n' + '='.repeat(60), 'cyan');
  log('✅ ENTORNO CAMBIADO EXITOSAMENTE', 'green');
  log('='.repeat(60), 'cyan');
  log(`📦 Nuevo entorno: ${env.toUpperCase()}`, 'blue');
  log('='.repeat(60), 'cyan');

  showCurrentConfig(env);

  log('\n💡 Reinicia el servidor para aplicar los cambios:', 'yellow');
  log('   npm run dev\n', 'cyan');
}

function showCurrentConfig(env) {
  if (!fs.existsSync(ENV_FILE)) {
    return;
  }

  const envContent = fs.readFileSync(ENV_FILE, 'utf-8');

  // Extraer configuraciones según el entorno
  const prefix = env === 'development' ? 'LOCAL' : 'PRODUCTION';

  const extractVar = (varName) => {
    const regex = new RegExp(`${prefix}_${varName}\\s*=\\s*(.+)`);
    const match = envContent.match(regex);
    return match ? match[1].trim() : 'No configurado';
  };

  log('\n📋 Configuración activa:', 'blue');
  log(`   🚀 Puerto: ${extractVar('PORT')}`, 'green');
  log(`   🌐 Cliente URL: ${extractVar('CLIENT_URL')}`, 'green');
  log(`   🗄️  Base de datos: ${extractVar('DATABASE_URL')}`, 'green');

  const storageModeMatch = envContent.match(/STORAGE_MODE\s*=\s*(\w+)/);
  const storageMode = storageModeMatch ? storageModeMatch[1] : 'local';
  log(`   💾 Storage Mode: ${storageMode.toUpperCase()}`, 'green');
}

function showStatus() {
  const currentEnv = getCurrentEnvironment();

  log('\n' + '='.repeat(60), 'cyan');
  log('📊 ESTADO DEL ENTORNO', 'blue');
  log('='.repeat(60), 'cyan');

  if (currentEnv) {
    log(`📦 Entorno actual: ${currentEnv.toUpperCase()}`, 'green');
    showCurrentConfig(currentEnv);
  } else {
    log('⚠️  No se pudo determinar el entorno actual', 'yellow');
  }

  log('='.repeat(60), 'cyan');
  log('\n💡 Para cambiar de entorno:', 'yellow');
  log('   node scripts/switch-env.js dev   # Cambiar a desarrollo', 'cyan');
  log('   node scripts/switch-env.js prod  # Cambiar a producción\n', 'cyan');
}

function showHelp() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🔧 CAMBIAR ENTORNO DE DESARROLLO/PRODUCCIÓN', 'blue');
  log('='.repeat(60), 'cyan');
  log('\nUso:', 'yellow');
  log('  node scripts/switch-env.js <comando>\n', 'green');
  log('Comandos:', 'yellow');
  log('  dev, development     Cambiar a entorno de desarrollo (LOCAL)', 'green');
  log('  prod, production     Cambiar a entorno de producción (AWS)', 'green');
  log('  status, current      Ver entorno actual', 'green');
  log('  help                 Mostrar esta ayuda\n', 'green');
  log('Ejemplos:', 'yellow');
  log('  node scripts/switch-env.js dev', 'cyan');
  log('  node scripts/switch-env.js prod', 'cyan');
  log('  node scripts/switch-env.js status\n', 'cyan');
  log('='.repeat(60), 'cyan');
}

// Main
const command = process.argv[2]?.toLowerCase();

switch (command) {
  case 'dev':
  case 'development':
    setEnvironment('development');
    break;

  case 'prod':
  case 'production':
    setEnvironment('production');
    break;

  case 'status':
  case 'current':
    showStatus();
    break;

  case 'help':
  case '-h':
  case '--help':
    showHelp();
    break;

  default:
    log('❌ Comando no reconocido\n', 'red');
    showHelp();
    process.exit(1);
}
