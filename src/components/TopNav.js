"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedButton } from "./ProtectedButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
];

export function TopNav() {
  const { isAdmin, isAuthenticated, isUser } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHydrated(true);
    }, 1000);
  }, []);

  return (
    <header className="top-nav">
      <Link href="/" className="logo" aria-label="Go to home">
        <span className="badge">Yudhish Singapuri</span>
        {/* <span className="badge">Freelancer</span>
        <span>Web Apps & N8N Automations</span> */}
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="pill nav-pill">
            {link.label}
          </Link>
        ))}
        <ProtectedButton className="pill nav-pill" href="/connect" redirectToLogin>
          Connect
        </ProtectedButton>
        {hydrated && !isAuthenticated && (
          <Link href="/login" className="pill nav-pill">
            Sign-In
          </Link>
        )}
        {hydrated && isUser && !isAdmin && (
          <Link href="/user/profile" className="pill nav-pill">
            User Profile
          </Link>
        )}
        {hydrated && isAdmin && (
          <Link href="/admin/profile" className="pill nav-pill">
            Admin Panel
          </Link>
        )}
      </nav>
    </header>
  );
}
