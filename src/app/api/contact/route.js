import { NextResponse } from "next/server";
import { ensureConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required." }, { status: 400 });
    }

    const payload = {
      name: name?.trim() || "New inquiry",
      email: email?.trim(),
      phone: phone?.trim(),
      message: message?.trim(),
    };

    const connection = await ensureConnection().catch(() => null);

    if (connection) {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(100),
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await connection.query(
        "INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?);",
        [payload.name, payload.email, payload.phone, payload.message]
      );

      return NextResponse.json({ ok: true, stored: true });
    }

    console.log("Contact submission (no DB configured yet):", payload);
    return NextResponse.json({ ok: true, stored: false, note: "DB not configured; message logged only." });
  } catch (error) {
    console.error("POST /api/contact failed", error);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}

