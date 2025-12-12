import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { getProjects } from "@/lib/projects";

export const revalidate = 0;

function splitProjects(projects) {
  const live = [];
  const inProgress = [];
  const n8n = [];

  for (const project of projects) {
    const category = (project.category || "").toLowerCase();
    if (category.includes("n8n")) {
      n8n.push(project);
      continue;
    }

    const status = (project.status || "").toLowerCase();
    if (status.includes("progress") || status.includes("building") || status.includes("planned")) {
      inProgress.push(project);
    } else {
      live.push(project);
    }
  }

  return { live, inProgress, n8n };
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const { live, inProgress, n8n } = splitProjects(projects);

  const sectionBlock = (title, items, emptyCopy) => (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        <span className="pill">Projects</span>
      </div>
      {items.length ? (
        <div className="card-grid">
          {items.map((project) => (
            <div key={project.id || project.title} className="glass project-card">
              <div className="project-meta">
                <span className="pill-ghost">{project.category || "Web Application"}</span>
                <span className="pill-ghost">{project.status || "Delivered"}</span>
              </div>
              <h3>{project.title}</h3>
              <p className="subtle">{project.description}</p>
              {project.tags?.length ? (
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {project.link ? (
                  <a className="btn btn-ghost" href={project.link} target="_blank" rel="noreferrer">
                    View project
                  </a>
                ) : null}
                {project.id ? (
                  <Link className="btn btn-ghost" href={`/projects/${project.id}/edit`}>
                    Edit
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ padding: 18 }}>
          <div className="subtle">{emptyCopy}</div>
        </div>
      )}
    </section>
  );

  return (
    <div className="page">
      <div className="content">
        <TopNav />

        <section className="section">
          <div className="section-header" style={{ alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2>Projects & automations</h2>
              <span className="pill">Web apps · n8n workflows</span>
            </div>
            <Link className="btn btn-primary" href="/projects/new">
              Add new project
            </Link>
          </div>
          <p className="subtle">
            A mix of production-grade web applications and n8n workflows. Stored in MySQL via the built-in API so new
            work can be added without redeploys.
          </p>
          <div className="tags" style={{ marginTop: 12 }}>
            {["Next.js", "React 19", "MySQL", "n8n", "API design", "DevOps"].map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {sectionBlock("Live & delivered", live, "New live projects will appear here soon.")}
        {sectionBlock("In progress / building now", inProgress, "Active builds will show up once they are added.")}
        {sectionBlock("N8N Workflows", n8n, "Add N8N workflow projects to see them here.")}

        <div className="footer-cta">
          <h3>Want to see a specific workflow or app?</h3>
          <p className="subtle">Tell me what you need and I&apos;ll share the most relevant examples.</p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary" href="/connect">
              Connect with me
            </Link>
            <Link className="btn btn-ghost" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

