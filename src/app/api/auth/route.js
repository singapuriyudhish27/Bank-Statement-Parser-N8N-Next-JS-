import { NextResponse } from "next/server";
import { ensureConnection } from "@/lib/db";
import { upsertUser } from "@/lib/users";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Prevent users from logging in with admin credentials
    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        { ok: false, error: "Please use the admin login for admin access." },
        { status: 401 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Persist/track user login in the database (creates DB/table if missing)
    try {
      const pool = await ensureConnection();
      await upsertUser(pool, { email, password });
    } catch (dbError) {
      console.error("POST /api/user-auth failed to store user:", dbError);
      return NextResponse.json(
        { ok: false, error: "Unable to store user login right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        email: email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("POST /api/user-auth failed", error);
    return NextResponse.json(
      { ok: false, error: "Unable to verify credentials right now." },
      { status: 500 }
    );
  }
}
