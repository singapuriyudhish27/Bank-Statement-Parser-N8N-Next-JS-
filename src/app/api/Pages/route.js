import { ensureConnection } from "@/lib/db";

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

export async function GET() {
  try {
    const pool = await ensureConnection();
    await ensureProjectsTable(pool);
    const [rows] = await pool.query(
      "SELECT id, title, description, category, status, link, tags FROM projects ORDER BY created_at DESC;"
    );

    if (!rows || rows.length === 0) {
      return Response.json({ projects: fallbackProjects });
    }

    const projects = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      status: row.status,
      link: row.link || "",
      tags: row.tags ? row.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    }));

    return Response.json({ projects });
  } catch (error) {
    console.error("Error fetching pages data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
