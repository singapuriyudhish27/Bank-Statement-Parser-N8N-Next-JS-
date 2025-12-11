import mysql from "mysql2/promise";

let pool;

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

function hasConfig() {
  return Boolean(dbConfig.host && dbConfig.user && dbConfig.database);
}

export function getPool() {
  if (pool) return pool;
  if (!hasConfig()) {
    return null;
  }

  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  return pool;
}

export async function ensureConnection() {
  const connection = getPool();
  if (!connection) {
    throw new Error("Database configuration missing. Add DB_HOST, DB_USER, DB_PASSWORD, DB_NAME to .env.");
  }
  return connection;
}

