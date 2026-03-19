import mysql from "mysql2/promise";

let pool;
let creatingPoolPromise = null;

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


async function ensureDatabaseExists() {
  const { database, ...baseConfig } = dbConfig;
  if (!database) {
    throw new Error("DB_NAME is required to create the database.");
  }
  const connection = await mysql.createConnection(baseConfig);
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  } finally {
    await connection.end();
  }
}

async function createPool() {
  if (pool) return pool;
  if (!hasConfig()) {
    throw new Error("Database configuration is missing. Please set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.");
  }

  await ensureDatabaseExists();

  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  return pool;
}

export function getPool() {
  return pool || null;
}

export async function ensureConnection() {
  if (pool) return pool;

  if (!creatingPoolPromise) {
    creatingPoolPromise = createPool().finally(() => {
      creatingPoolPromise = null;
    });
  }

  return creatingPoolPromise;
}

