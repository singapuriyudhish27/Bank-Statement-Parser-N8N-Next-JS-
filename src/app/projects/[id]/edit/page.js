"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";

const statusOptions = ["Planned", "In Progress", "Delivered", "Live"];
const categoryOptions = ["Web Application", "N8N Workflow"];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  // Handle case where id might be an array (Next.js dynamic routes)
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tools: "",
    status: "Planned",
    category: "Web Application",
    link: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const updateField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const updateLogin = (key) => (e) => {
    setLoginForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  useEffect(() => {
    // Load project data
    const loadProject = async () => {
      try {
        if (!projectId) {
          setError("Project ID is missing");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load project");
        }

        if (!data.project) {
          throw new Error("Project data is missing");
        }

        const project = data.project;
        
        setForm({
          title: project.title || "",
          description: project.description || "",
          tools: project.tags?.join(", ") || "",
          status: project.status || "Planned",
          category: project.category || "Web Application",
          link: project.link || "",
        });
        setError(null);
      } catch (err) {
        console.error("Error loading project:", err);
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Only Admin can Access. Invalid credentials.");
      }
      setAuthed(true);
      setLoginError("");
    } catch (err) {
      setLoginError(err.message || "Only Admin can Access.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!authed) {
      setMessage({ type: "error", text: "Only Admin can Access. Please login first." });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: projectId,
          title: form.title,
          description: form.description,
          category: form.category,
          status: form.status,
          link: form.link,
          tags: form.tools
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          // Include admin credentials for server-side authentication
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update project");
      }

      setMessage({ type: "success", text: "Project updated successfully." });
      setTimeout(() => {
        router.push("/projects");
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="content">
          <TopNav />
          <section className="section">
            <div className="glass" style={{ padding: 18 }}>
              <p className="subtle">Loading project...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="content">
        <TopNav />

        <section className="section">
          <div className="section-header">
            <h2>Edit project</h2>
            <span className="pill">Admin only</span>
          </div>
          <p className="subtle" style={{ marginBottom: 16 }}>
            Update project details. Only admins can edit projects.
          </p>

          {error && !loading ? (
            <div className="notice notice-error" style={{ marginBottom: 16 }}>
              {error}. You can still login and try to edit the project.
            </div>
          ) : null}

          {!authed ? (
            <div className="glass" style={{ padding: 18, marginBottom: 16 }}>
              <div className="section-header" style={{ marginBottom: 8 }}>
                <h3>Admin login required</h3>
                <span className="pill-ghost">Restricted</span>
              </div>
              <p className="subtle" style={{ marginBottom: 12 }}>
                Please login with admin credentials to edit this project.
              </p>
              <form className="form-card" onSubmit={handleLogin}>
                <div className="form-grid">
                  <label className="field">
                    <span>Admin email</span>
                    <input
                      value={loginForm.email}
                      onChange={updateLogin("email")}
                      placeholder="admin@example.com"
                      type="email"
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Password</span>
                    <input
                      value={loginForm.password}
                      onChange={updateLogin("password")}
                      placeholder="••••••••"
                      type="password"
                      required
                    />
                  </label>
                </div>
                {loginError ? <div className="notice notice-error">{loginError}</div> : null}
                <div className="modal-actions">
                  <button className="btn btn-primary" type="submit">
                    Login as Admin
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="notice notice-success" style={{ marginBottom: 12 }}>
              Admin verified. You can edit this project.
            </div>
          )}

          {!authed ? null : (
            <form className="form-card" onSubmit={onSubmit}>
              <div className="form-grid">
                <label className="field">
                  <span>Project name</span>
                  <input
                    required
                    value={form.title}
                    onChange={updateField("title")}
                    placeholder="e.g., Founder CRM portal"
                  />
                </label>

                <label className="field">
                  <span>Category</span>
                  <select value={form.category} onChange={updateField("category")}>
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Status</span>
                  <select value={form.status} onChange={updateField("status")}>
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Link (optional)</span>
                  <input
                    value={form.link}
                    onChange={updateField("link")}
                    placeholder="https://example.com"
                    type="url"
                  />
                </label>
              </div>

              <label className="field">
                <span>Description</span>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={updateField("description")}
                  placeholder="What was built, outcomes, and impact."
                />
              </label>

              <label className="field">
                <span>Tools & technologies (comma-separated)</span>
                <input
                  value={form.tools}
                  onChange={updateField("tools")}
                  placeholder="Next.js, MySQL, n8n, Stripe"
                />
              </label>

              {message ? (
                <div className={`notice ${message.type === "error" ? "notice-error" : "notice-success"}`}>
                  {message.text}
                </div>
              ) : null}

              <div className="cta-row" style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Updating..." : "Update project"}
                </button>
                <Link className="btn btn-ghost" href="/projects">
                  Back to projects
                </Link>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
