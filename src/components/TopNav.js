import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/connect", label: "Connect" },
];

export function TopNav() {
  return (
    <header className="top-nav">
      <Link href="/" className="logo" aria-label="Go to home">
        <span className="badge">Freelancer - Yudhish Singapuri</span>
        {/* <span>Web Apps & N8N Automations</span> */}
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="pill nav-pill">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

