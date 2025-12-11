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

function isLocalHost(hostname) {
  return hostname === "127.0.0.1" || hostname === "localhost";
}

function shouldSkipInProd() {
  return (
    process.env.NODE_ENV === "production" &&
    (!hasConfig() || isLocalHost(dbConfig.host))
  );
}

export function getPool() {
  if (pool) return pool;
  if (shouldSkipInProd()) {
    console.warn(
      "Database not reachable in production. Skipping DB pool creation and falling back to static data."
    );
    return null;
  }
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
    throw new Error(
      "Database unavailable. Provide DB_HOST/DB_USER/DB_PASSWORD/DB_NAME and avoid localhost in production."
    );
  }
  return connection;
}

