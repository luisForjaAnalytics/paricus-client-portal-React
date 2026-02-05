/**
 * Logger utility for production-safe logging
 * Only logs in development mode to avoid exposing sensitive information
 */

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

/**
 * Log levels with corresponding console methods
 */
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

/**
 * Create a logger instance
 * @param {string} prefix - Optional prefix for log messages (e.g., component name)
 * @returns {Object} Logger methods
 */
export const createLogger = (prefix = '') => {
  const formatMessage = (message) => {
    return prefix ? `[${prefix}] ${message}` : message;
  };

  return {
    debug: (message, ...args) => {
      if (isDev) {
        console.debug(formatMessage(message), ...args);
      }
    },

    info: (message, ...args) => {
      if (isDev) {
        console.info(formatMessage(message), ...args);
      }
    },

    warn: (message, ...args) => {
      if (isDev) {
        console.warn(formatMessage(message), ...args);
      }
    },

    error: (message, ...args) => {
      if (isDev) {
        console.error(formatMessage(message), ...args);
      }
      // In production, you could send errors to a monitoring service
      // Example: sendToErrorTracking(message, args);
    },
  };
};

/**
 * Default logger instance (no prefix)
 */
export const logger = createLogger();

/**
 * Log only in development
 * @deprecated Use logger.debug/info/warn/error instead
 */
export const devLog = (message, ...args) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

/**
 * Log error only in development
 * @deprecated Use logger.error instead
 */
export const devError = (message, ...args) => {
  if (isDev) {
    console.error(message, ...args);
  }
};

export default logger;
