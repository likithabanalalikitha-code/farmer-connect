const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || (process.env.VERCEL ? 'production' : 'development'),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_market_connect',
  jwtSecret: process.env.JWT_SECRET || 'farmer_market_connect_jwt_secret_dev_key_change_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@farmermarket.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123456'
};

const validateEnv = () => {
  if (!process.env.JWT_SECRET && config.nodeEnv === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production!');
  }
  if (!process.env.MONGO_URI && config.nodeEnv === 'production') {
    throw new Error('FATAL: MONGO_URI environment variable is required in production!');
  }
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  WARNING: GROQ_API_KEY is not set. Groq AI Assistant will operate with simulated agricultural marketplace fallback responses.');
  }
};

validateEnv();

module.exports = config;
