const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // e.g. "test"
  process.env.DB_USER,     // e.g. "xxxxxx.root"
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,           // e.g. gateway.ap-northeast-1.aws.tidbcloud.com
    port: process.env.DB_PORT || 4000,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false        // ✅ STILL REQUIRED for TiDB Cloud Starter (self-signed cert)
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
