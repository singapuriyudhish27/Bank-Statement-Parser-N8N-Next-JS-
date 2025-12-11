import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { ok: false, error: "Admin credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const ok = email === adminEmail && password === adminPassword;
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Only Admin can Access. Invalid credentials." }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/admin-auth failed", error);
    return NextResponse.json({ ok: false, error: "Unable to verify credentials right now." }, { status: 500 });
  }
}

