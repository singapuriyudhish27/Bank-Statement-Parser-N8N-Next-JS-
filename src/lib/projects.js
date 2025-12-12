import { ensureConnection, getPool } from "./db";

const fallbackProjects = [];

async function ensureProjectsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'Planned',
      link VARCHAR(500),
      tags TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export async function getProjects() {
  const pool = getPool();
  if (!pool) {
    return fallbackProjects;
  }

  try {
    await ensureProjectsTable(pool);
    const [rows] = await pool.query(
      "SELECT id, title, description, category, status, link, tags FROM projects ORDER BY created_at DESC;"
    );

    if (!rows || rows.length === 0) {
      return fallbackProjects;
    }

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      status: row.status,
      link: row.link || "",
      tags: row.tags ? row.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return fallbackProjects;
  }
}

export async function createProject(project) {
  const connection = await ensureConnection();
  await ensureProjectsTable(connection);

  const payload = {
    title: project.title?.trim(),
    description: project.description?.trim() || "",
    category: project.category?.trim() || "Web Application",
    status: project.status?.trim() || "Planned",
    link: project.link?.trim() || "",
    tags: project.tags?.length ? project.tags.join(",") : "",
  };

  if (!payload.title) {
    throw new Error("Title is required");
  }

  const [result] = await connection.query(
    "INSERT INTO projects (title, description, category, status, link, tags) VALUES (?, ?, ?, ?, ?, ?);",
    [payload.title, payload.description, payload.category, payload.status, payload.link, payload.tags]
  );

  return { id: result.insertId, ...payload };
}

export async function updateProject(id, project) {
  const connection = await ensureConnection();
  await ensureProjectsTable(connection);

  // First check if project exists
  const [existing] = await connection.query("SELECT id FROM projects WHERE id = ?", [id]);
  if (!existing || existing.length === 0) {
    throw new Error("Project not found");
  }

  const payload = {
    title: project.title?.trim(),
    description: project.description?.trim() || "",
    category: project.category?.trim() || "Web Application",
    status: project.status?.trim() || "Planned",
    link: project.link?.trim() || "",
    tags: project.tags?.length ? project.tags.join(",") : "",
  };

  if (!payload.title) {
    throw new Error("Title is required");
  }

  await connection.query(
    "UPDATE projects SET title = ?, description = ?, category = ?, status = ?, link = ?, tags = ? WHERE id = ?",
    [payload.title, payload.description, payload.category, payload.status, payload.link, payload.tags, id]
  );

  return { id: parseInt(id), ...payload };
}

export async function getProjectById(id) {
  const pool = getPool();
  if (!pool) {
    console.error("Database pool not available");
    return null;
  }

  try {
    // Ensure id is a number
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) {
      console.error("Invalid project ID:", id);
      return null;
    }

    await ensureProjectsTable(pool);
    const [rows] = await pool.query(
      "SELECT id, title, description, category, status, link, tags FROM projects WHERE id = ?",
      [projectId]
    );

    if (!rows || rows.length === 0) {
      console.log("No project found with ID:", projectId);
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      status: row.status,
      link: row.link || "",
      tags: row.tags ? row.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

