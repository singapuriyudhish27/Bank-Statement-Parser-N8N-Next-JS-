"use client";

import { useAuth } from "@/contexts/AuthContext";
import { TopNav } from "@/components/TopNav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function UserPanelPage() {
  const { user, logoutUser, isUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isUser) {
      router.push("/");
    }
  }, [loading, isUser, router]);

  if (loading) {
    return (
      <div className="page">
        <div className="content">
          <TopNav />
          <section className="section">
            <div className="glass" style={{ padding: 18 }}>
              <p className="subtle">Loading...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!isUser) {
    return null;
  }

  return (
    <div className="page">
      <div className="content">
        <TopNav />

        <section className="section">
          <div className="section-header">
            <h2>User Panel</h2>
            <span className="pill">Welcome back</span>
          </div>

          <div className="glass" style={{ padding: 24, marginTop: 16 }}>
            <div style={{ marginBottom: 20 }}>
              <div className="badge">Account Information</div>
              <h3 style={{ marginTop: 10, marginBottom: 6 }}>Your Profile</h3>
              <p className="subtle">
                Email: <strong>{user?.email}</strong>
              </p>
              <p className="subtle" style={{ marginTop: 8 }}>
                Role: <strong>{user?.role || "User"}</strong>
              </p>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ marginBottom: 12 }}>Quick Actions</h3>
              <div className="cta-row" style={{ flexWrap: "wrap", gap: 12 }}>
                <Link className="btn btn-primary" href="/connect">
                  Connect
                </Link>
                <Link className="btn btn-ghost" href="/projects">
                  View Projects
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  logoutUser();
                  router.push("/");
                }}
                style={{ color: "var(--error, #ff4444)" }}
              >
                Logout
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
