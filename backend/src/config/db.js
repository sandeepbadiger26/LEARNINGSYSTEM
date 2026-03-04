const knex = require('knex');
const env = require('./env');

const db = knex({
  client: 'mysql2',
  connection: {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    ssl: env.db.ssl ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: '../migrations'
  }
});

module.exports = db;
