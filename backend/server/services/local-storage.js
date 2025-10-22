import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local storage root directory (outside of server directory)
const STORAGE_ROOT = path.join(__dirname, '../../local-storage');

/**
 * Ensure a directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Initialize local storage directory structure
 */
export async function initializeLocalStorage() {
  await ensureDir(STORAGE_ROOT);
  console.log('Local file storage initialized at:', STORAGE_ROOT);
}

/**
 * Save a file to local storage
 * @param {string} key - File path (e.g., 'client-access-reports/im-telecom/invoices/2024/invoice.pdf')
 * @param {Buffer} buffer - File content
 * @returns {Promise<string>} - Local file path
 */
export async function saveLocalFile(key, buffer) {
  const filePath = path.join(STORAGE_ROOT, key);
  const dirPath = path.dirname(filePath);

  await ensureDir(dirPath);
  await fs.writeFile(filePath, buffer);

  return filePath;
}

/**
 * Read a file from local storage
 * @param {string} key - File path
 * @returns {Promise<Buffer>} - File content
 */
export async function readLocalFile(key) {
  const filePath = path.join(STORAGE_ROOT, key);
  return await fs.readFile(filePath);
}

/**
 * Delete a file from local storage
 * @param {string} key - File path
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteLocalFile(key) {
  try {
    const filePath = path.join(STORAGE_ROOT, key);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting local file:', error);
    return false;
  }
}

/**
 * List files in a directory
 * @param {string} prefix - Directory prefix
 * @returns {Promise<Array>} - Array of file objects
 */
export async function listLocalFiles(prefix) {
  try {
    const dirPath = path.join(STORAGE_ROOT, prefix);

    // Check if directory exists
    try {
      await fs.access(dirPath);
    } catch {
      // Directory doesn't exist, return empty array
      return [];
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true, recursive: true });

    const files = [];
    for (const entry of entries) {
      if (entry.isFile()) {
        const fullPath = path.join(entry.path || dirPath, entry.name);
        const relativePath = path.relative(STORAGE_ROOT, fullPath);
        const stats = await fs.stat(fullPath);

        files.push({
          key: relativePath.replace(/\\/g, '/'), // Convert Windows paths to forward slashes
          fileName: entry.name,
          size: stats.size,
          lastModified: stats.mtime,
        });
      }
    }

    return files;
  } catch (error) {
    console.error('Error listing local files:', error);
    return [];
  }
}

/**
 * Generate a local URL for file access (for development)
 * @param {string} key - File path
 * @returns {string} - Local file URL
 */
export function generateLocalFileUrl(key) {
  // Return an API endpoint that will serve the file
  return `/api/invoices/local-file/${encodeURIComponent(key)}`;
}

/**
 * List client folders from local storage
 * @returns {Promise<Array>} - Array of folder names
 */
export async function listLocalClientFolders() {
  try {
    const reportsPath = path.join(STORAGE_ROOT, 'client-access-reports');

    try {
      await fs.access(reportsPath);
    } catch {
      return [];
    }

    const entries = await fs.readdir(reportsPath, { withFileTypes: true });
    const folders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    return folders;
  } catch (error) {
    console.error('Error listing local client folders:', error);
    return [];
  }
}

/**
 * Check if a file exists in local storage
 * @param {string} key - File path
 * @returns {Promise<boolean>} - Whether file exists
 */
export async function localFileExists(key) {
  try {
    const filePath = path.join(STORAGE_ROOT, key);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file metadata
 * @param {string} key - File path
 * @returns {Promise<Object>} - File metadata
 */
export async function getLocalFileMetadata(key) {
  try {
    const filePath = path.join(STORAGE_ROOT, key);
    const stats = await fs.stat(filePath);

    return {
      size: stats.size,
      lastModified: stats.mtime,
      created: stats.birthtime
    };
  } catch (error) {
    console.error('Error getting local file metadata:', error);
    return null;
  }
}

export { STORAGE_ROOT };
