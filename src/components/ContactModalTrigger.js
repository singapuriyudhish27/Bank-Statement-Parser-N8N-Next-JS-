"use client";

import { useState } from "react";

export function ContactModalTrigger({ triggerText, variant = "primary" }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.note,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to submit. Please try again.");
      }
      setMessage({ type: "success", text: "Thanks! I will reply within one business day." });
      setForm({ name: "", email: "", phone: "", note: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"}`}
        onClick={() => setOpen(true)}
      >
        {triggerText}
      </button>

      {open ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <div className="badge">Get in touch</div>
                <h3>Tell me about your project</h3>
                <p className="subtle">Share your contact and I&apos;ll reply within one business day.</p>
              </div>
              <button className="pill-ghost" type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <form className="form-card" onSubmit={submit}>
              <div className="form-grid">
                <label className="field">
                  <span>Name</span>
                  <input value={form.name} onChange={update("name")} placeholder="Your name" />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input value={form.email} onChange={update("email")} placeholder="you@example.com" type="email" />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input value={form.phone} onChange={update("phone")} placeholder="+1 234 567 8901" />
                </label>
              </div>

              <label className="field">
                <span>Project / automation needs</span>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={update("note")}
                  placeholder="Goals, timelines, links, or anything that helps me prepare."
                />
              </label>

              {message ? (
                <div className={`notice ${message.type === "error" ? "notice-error" : "notice-success"}`}>
                  {message.text}
                </div>
              ) : null}

              <div className="modal-actions">
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Sending..." : "Send message"}
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

