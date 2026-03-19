"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedButton } from "./ProtectedButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/Pages/Projects", label: "Projects" },
];

export function TopNav() {
  const { isAdmin, isAuthenticated, isUser } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated after mount to avoid hydration mismatch
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const navItemVariants = {
    hover: { scale: 1.05, translateZ: 20, transition: { type: "spring", stiffness: 400, damping: 10 } }
  };

  return (
    <header className="top-nav" style={{ transformStyle: "preserve-3d" }}>
      <Link href="/" className="logo" aria-label="Go to home">
        <motion.span whileHover="hover" variants={navItemVariants} className="badge">Yudhish Singapuri</motion.span>
      </Link>
      <nav className="nav-links" aria-label="Primary" suppressHydrationWarning style={{ transformStyle: "preserve-3d" }}>
        {navLinks.map((link) => (
          <motion.div key={link.href} whileHover="hover" variants={navItemVariants}>
            <Link href={link.href} className="pill nav-pill">
              {link.label}
            </Link>
          </motion.div>
        ))}
        <motion.div whileHover="hover" variants={navItemVariants}>
          <ProtectedButton className="pill nav-pill" href="/Pages/Connect" redirectToLogin>
            Connect
          </ProtectedButton>
        </motion.div>
        {hydrated && !isAuthenticated && (
          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link href="/auth/Login" className="pill nav-pill">
              Sign-In
            </Link>
          </motion.div>
        )}
        {hydrated && isUser && !isAdmin && (
          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link href="/Pages/Profile" className="pill nav-pill">
              Profile
            </Link>
          </motion.div>
        )}
        {hydrated && isAdmin && (
          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link href="/Pages/Admin/Profile" className="pill nav-pill">
              Admin
            </Link>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
