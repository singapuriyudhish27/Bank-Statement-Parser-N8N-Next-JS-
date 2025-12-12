"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "./LoginModal";

export function ProtectedButton({
  children,
  onClick,
  className,
  href,
  redirectToLogin = false,
  ...props
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();

      if (redirectToLogin) {
        const next = href || "/";
        router.push(`/login?redirect=${encodeURIComponent(next)}`);
        return;
      }

      setLoginOpen(true);
      return;
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleLoginSuccess = () => {
    if (href) {
      // For tel: and mailto: links, we can navigate directly
      if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        window.location.href = href;
      } else {
        window.location.href = href;
      }
    } else if (onClick) {
      // Trigger the original action after login
      const syntheticEvent = { preventDefault: () => {} };
      onClick(syntheticEvent);
    }
  };

  if (href) {
    return (
      <>
        <a
          href={isAuthenticated ? href : "#"}
          onClick={handleClick}
          className={className}
          {...props}
        >
          {children}
        </a>
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={handleLoginSuccess}
          title="Login to Continue"
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        title="Login to Continue"
      />
    </>
  );
}
