import { ensureConnection, getPool } from "./db";

const fallbackProjects = [
  {
    id: "fallback-1",
    title: "Founder CRM & client portal",
    description: "Built a secure portal with client onboarding, billing integrations, and automation-ready webhooks.",
    category: "Web Application",
    status: "Live",
    tags: ["Next.js", "MySQL", "Stripe", "Auth"],
    link: "#",
  },
  {
    id: "fallback-2",
    title: "Lead enrichment & routing (n8n)",
    description: "Automated lead capture across forms, enriched with Clearbit-like data, deduped, and routed instantly.",
    category: "n8n Workflow",
    status: "Live",
    tags: ["n8n", "Webhooks", "Queues"],
    link: "#",
  },
  {
    id: "fallback-3",
    title: "Product launch stack",
    description: "Landing + waitlist logic, onboarding emails, analytics events, and edge caching for global speed.",
    category: "Web Application",
    status: "Delivered",
    tags: ["Next.js", "Email", "Analytics"],
    link: "#",
  },
];

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

