import Link from "next/link";
import { TopNav } from "@/components/TopNav";

export const revalidate = 0;

export default function ConnectPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || contactPhone;
  const whatsAppDigits = whatsappNumber.replace(/[^0-9]/g, "");
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL;
  const github = process.env.NEXT_PUBLIC_GITHUB_URL;

  const links = [
    {
      title: "Call",
      value: contactPhone,
      href: `tel:${contactPhone}`,
      cta: "Call now",
    },
    {
      title: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      cta: "Email me",
    },
    {
      title: "WhatsApp",
      value: whatsappNumber,
      href: `https://wa.me/${whatsAppDigits}`,
      cta: "Start chat",
    },
    {
      title: "LinkedIn",
      value: "View profile",
      href: linkedin,
      cta: "Open",
    },
    {
      title: "GitHub",
      value: "See code",
      href: github,
      cta: "Open",
    },
  ];

  return (
    <div className="page">
      <div className="content">
        <TopNav />

        <section className="section">
          <div className="section-header">
            <h2>Connect with me</h2>
            <span className="pill">Replies within 12 hours</span>
          </div>
          <p className="lead" style={{ maxWidth: 760 }}>
            Reach out the way you prefer—calls, email, WhatsApp, or socials. Share a quick brief or a voice note and
            I&apos;ll respond with next steps and a clear plan.
          </p>
        </section>

        <section className="section contact">
          <div className="contact-card">
            <div className="badge">Direct lines</div>
            <h3 style={{ marginTop: 10, marginBottom: 10 }}>Quick contact</h3>
            <div className="contact-list">
              {links.slice(0, 3).map((item) => (
                <div key={item.title} className="contact-item">
                  <div>
                    <strong>{item.title}</strong>
                    <div className="subtle">{item.value}</div>
                  </div>
                  <a className="btn btn-ghost" href={item.href} target="_blank" rel="noreferrer">
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="glass workflow-card">
            <div className="badge">Social</div>
            <h3>Follow or message</h3>
            <div className="link-grid">
              {links.slice(3).map((item) => (
                <div key={item.title} className="link-card">
                  <div>
                    <strong>{item.title}</strong>
                    <div className="subtle">{item.value}</div>
                  </div>
                  <a className="link-btn" href={item.href} target="_blank" rel="noreferrer">
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>
            <p className="subtle" style={{ marginTop: 12 }}>
              Prefer a brief? Send bullet points for scope, deadline, and budget range. I&apos;ll reply with a simple
              proposal and timelines.
            </p>
            <div className="cta-row" style={{ marginTop: 12 }}>
              <Link className="btn btn-primary" href="/projects">
                View projects
              </Link>
              <Link className="btn btn-ghost" href="/">
                Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

