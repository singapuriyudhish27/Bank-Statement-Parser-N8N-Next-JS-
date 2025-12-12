import { NextResponse } from "next/server";

/**
 * Verifies admin credentials from request headers or body
 * @param {Request} request - The incoming request
 * @returns {Object|null} - Returns { email, password } if valid, null otherwise
 */
export function verifyAdminAuth(request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return null;
  }

  // Try to get credentials from Authorization header (Basic auth)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    const credentials = Buffer.from(authHeader.substring(6), "base64").toString("utf-8");
    const [email, password] = credentials.split(":");
    if (email === adminEmail && password === adminPassword) {
      return { email, password };
    }
  }

  // Try to get credentials from request body (for JSON requests)
  // Note: This requires the body to be parsed, so it's handled in the route handler
  return null;
}

/**
 * Middleware function to check admin authentication
 * Returns a NextResponse with error if not authenticated, null if authenticated
 * @param {Request} request - The incoming request
 * @param {Object} body - Optional parsed request body (for email/password fields)
 * @returns {NextResponse|null} - Error response if not authenticated, null if authenticated
 */
export async function requireAdminAuth(request, body = null) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 }
    );
  }

  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    const credentials = Buffer.from(authHeader.substring(6), "base64").toString("utf-8");
    const [email, password] = credentials.split(":");
    if (email === adminEmail && password === adminPassword) {
      return null; // Authenticated
    }
  }

  // Check request body for email/password (for backward compatibility)
  if (body && body.email && body.password) {
    if (body.email === adminEmail && body.password === adminPassword) {
      return null; // Authenticated
    }
  }

  // Check for admin credentials in custom headers (alternative approach)
  const headerEmail = request.headers.get("x-admin-email");
  const headerPassword = request.headers.get("x-admin-password");
  if (headerEmail === adminEmail && headerPassword === adminPassword) {
    return null; // Authenticated
  }

  return NextResponse.json(
    { error: "Only Admin can Access. Invalid or missing credentials." },
    { status: 401 }
  );
}
