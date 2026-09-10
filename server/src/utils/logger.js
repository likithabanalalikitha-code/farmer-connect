const config = require('../config/env');

const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
  },
  error: (message, trace = '') => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, trace ? trace : '');
  },
  debug: (message, meta = '') => {
    if (config.nodeEnv !== 'production') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    }
  }
};

module.exports = logger;
