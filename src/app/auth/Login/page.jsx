"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { loginUser, loginAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");
    // Try admin first (checks against ADMIN_EMAIL/ADMIN_PASSWORD); fall back to user login
    const adminAttempt = await loginAdmin(form.email, form.password);
    if (adminAttempt.success) {
      router.replace("/");
      setPending(false);
      return;
    }

    const userAttempt = await loginUser(form.email, form.password);
    if (userAttempt.success) {
      router.replace("/");
    } else {
      setError(userAttempt.error || adminAttempt.error || "Login failed. Please try again.");
    }
    setPending(false);
  };

  return (
    <div className="page">
      <div className="content">
        <TopNav />

        <section className="section">
          <div className="section-header">
            <h2>Sign In</h2>
            <span className="pill">Account</span>
          </div>
          <p className="subtle" style={{ marginBottom: 16 }}>
            Enter your email and password to sign in.
          </p>

          <div className="glass" style={{ padding: 18 }}>
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={update("password")}
                    placeholder="••••••••"
                    required
                  />
                </label>
              </div>

              {error ? <div className="notice notice-error">{error}</div> : null}

              <div className="cta-row" style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={pending}>
                  {pending ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
