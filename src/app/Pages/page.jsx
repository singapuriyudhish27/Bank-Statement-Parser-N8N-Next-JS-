// HomePage is a Server Component to fetch data directly from MySQL


import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { TopNav } from "@/components/TopNav";
import { ContactModalTrigger } from "@/components/ContactModalTrigger";
import { ProtectedButton } from "@/components/ProtectedButton";
import { Hero3D } from "@/components/Hero3D";
import { InteractiveCard } from "@/components/InteractiveCard";

export const revalidate = 0;

const stats = [
  { value: "3+", label: "Projects shipped" },
  { value: "12h", label: "Avg. response time" },
  { value: "98%", label: "On-time delivery" },
  { value: "n8n", label: "Automation focused" },
];

const skills = [
  {
    title: "Full Stack Development",
    items: ["Next.JS", "React-JS", "HTML, CSS, JavaScript", "MySQL", "MongoDB", "Node.JS", "Express.JS", "REST API", "API Integration", "Auth & security"],
  },
  {
    title: "Automation",
    items: ["N8N Workflows", "AI Automations", "RAG", "AI Agents", "Vector Databases", "Chunking & Embeddings", "MCP", "LLMs", "Monitoring"],
  },
  {
    title: "Ship & Iterate",
    items: ["Sprint planning", "Weekly demos", "Analytics", "Performance"],
  },
];

export default async function HomePage() {
  const projects = await getProjects();

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || contactPhone || "";
  const whatsAppDigits = whatsappNumber.replace(/[^0-9]/g, "");
  const n8nProjects = projects.filter((p) => (p.category || "").toLowerCase().includes("n8n"));
  const webAppProjects = projects
    .filter((p) => !(p.category || "").toLowerCase().includes("n8n"))
    .slice(0, 3);

  return (
    <div className="page">
      <div className="content">
        <TopNav />

        <section className="hero">
          <Hero3D>
            <div>
              <div className="eyebrow">Full Stack Developer & AI Automations-N8N Engineer</div>
              <h1>
                Hi, I&apos;m <span>Yudhish Singapuri</span>. I build premium{" "}
                <span>web Applications</span> and <span>AI Automation workflows</span> to reduce human efforts.
              </h1>
              <p className="lead">
                From strategy to launch, I ship polished products, integrate the tools you already use, and automate the
                busywork so you can move faster.
              </p>
              <div className="cta-row">
                <ContactModalTrigger triggerText="Book a call" variant="primary" />
                <ProtectedButton className="btn btn-ghost" href={`tel:${contactPhone}`}>
                  Call me
                </ProtectedButton>
                <Link className="btn btn-ghost" href="/Pages/Projects">
                  View projects
                </Link>
              </div>
              <div className="stats">
                {stats.map((item) => (
                  <div className="stat-card" key={item.label}>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Hero3D>
          <div className="hero-right">
            <InteractiveCard>
              <div className="hero-profile-wrap">
                <div className="hero-profile">
                  <Image src="/profile.jpg" alt="Portrait of Yudhish Singapuri" width={260} height={260} priority />
                </div>
              </div>
              <div className="glass">
                <div className="badge">Delivery Approach</div>
                <h3 style={{ marginTop: 10, marginBottom: 6 }}>Strategy → Build → Automate</h3>
                <p className="subtle">
                  Opinionated processes so you can see progress weekly: scoped sprints, transparent updates, and
                  observability baked in.
                </p>
                <div className="tags" style={{ marginTop: 12 }}>
                  {["Next.js", "React", "MySQL", "MongoDB", "N8N", "REST API", "API Integration", "Authentication", "Deploy"].map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="pill-ghost">Edge deployments · Secure forms · SEO ready</div>
                </div>
              </div>
            </InteractiveCard>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Skill sets & focus</h2>
            <span className="pill">What you get</span>
          </div>
          <div className="skills-grid">
            {skills.map((skill) => (
              <InteractiveCard key={skill.title} className="skill-card">
                <div className="skill-title">{skill.title}</div>
                <div className="tags">
                  {skill.items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </InteractiveCard>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Web Applications</h2>
            <span className="pill">Latest 3 projects</span>
          </div>
          <div className="card-grid">
            {webAppProjects.map((project) => (
              <InteractiveCard key={project.id || project.title} className="project-card">
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
                {project.link ? (
                  <a className="btn btn-ghost" href={project.link} target="_blank" rel="noreferrer">
                    View project
                  </a>
                ) : null}
              </InteractiveCard>
            ))}
          </div>
        </section>

        {n8nProjects.length ? (
          <section className="section">
            <div className="section-header">
              <h2>N8N Workflows</h2>
              <span className="pill">Automation builds</span>
            </div>
            <div className="card-grid">
              {n8nProjects.map((project) => (
                <InteractiveCard key={project.id || project.title} className="project-card">
                  <div className="project-meta">
                    <span className="pill-ghost">{project.category || "N8N Workflow"}</span>
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
                  {project.link ? (
                    <a className="btn btn-ghost" href={project.link} target="_blank" rel="noreferrer">
                      View project
                    </a>
                  ) : null}
                </InteractiveCard>
              ))}
            </div>
          </section>
        ) : null}

        

        <section className="section contact">
          <InteractiveCard className="contact-card" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
            <div className="badge">Let&apos;s build</div>
            <h3 style={{ marginTop: 10, marginBottom: 10 }}>Tell me about your project</h3>
            <p className="subtle">
              Reach out by email or phone and I will reply within one business day with next steps and a clear plan.
            </p>
            <div className="contact-list">
              <div className="contact-item">
                <div>
                  <strong>Email</strong>
                  <div className="subtle">{contactEmail}</div>
                </div>
                <a className="btn btn-ghost" href={`mailto:${contactEmail}`}>
                  Email me
                </a>
              </div>
              <div className="contact-item">
                <div>
                  <strong>Mobile</strong>
                  <div className="subtle">{contactPhone}</div>
                </div>
                <a className="btn btn-ghost" href={`tel:${contactPhone}`}>
                  Call
                </a>
              </div>
              <div className="contact-item">
                <div>
                  <strong>WhatsApp</strong>
                  <div className="subtle">{whatsappNumber}</div>
                </div>
                <a className="btn btn-ghost" href={`https://wa.me/${whatsAppDigits}`} target="_blank" rel="noreferrer">
                  Chat
                </a>
              </div>
            </div>
          </InteractiveCard>
          <InteractiveCard className="glass workflow-card">
            <div className="badge">Process</div>
            <h3>Working together</h3>
            <div className="tags">
              {["Discovery call", "Proposal & timeline", "Design & build", "Test & launch", "Automation & monitoring"].map(
                (step) => (
                  <span key={step} className="tag">
                    {step}
                  </span>
                )
              )}
            </div>
            <p className="subtle" style={{ marginTop: 10 }}>
              Backend endpoints are wired for MySQL so new projects and contact details can be added without code
              changes—ready for a lightweight admin UI or CMS later.
            </p>
            <div style={{ marginTop: 12 }}>
              <ProtectedButton className="btn btn-primary" href="/Pages/Connect">
                Connect with me
              </ProtectedButton>
            </div>
          </InteractiveCard>
        </section>

        <div className="footer-cta">
          <InteractiveCard style={{ background: "transparent", border: "none", boxShadow: "none" }}>
            <h3>Ready to ship something great?</h3>
            <p className="subtle">
              I handle the stack so you can focus on the business. Premium design, reliable automations, clean handover.
            </p>
            <div className="cta-row" style={{ justifyContent: "center" }}>
              <ContactModalTrigger triggerText="Start a project" variant="primary" />
              <ProtectedButton className="btn btn-ghost" href={`tel:${contactPhone}`}>
                Talk on the phone
              </ProtectedButton>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  );
}
