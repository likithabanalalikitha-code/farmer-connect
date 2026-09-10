const app = require('../src/app');
const connectDB = require('../src/config/db');

let databaseConnection;

module.exports = async (req, res) => {
  // Let Express answer browser preflight requests even if MongoDB is unavailable.
  if (req.method === 'OPTIONS') {
    return app(req, res);
  }

  if (!databaseConnection) {
    databaseConnection = connectDB().catch((error) => {
      databaseConnection = undefined;
      throw error;
    });
  }

  await databaseConnection;
  return app(req, res);
};
