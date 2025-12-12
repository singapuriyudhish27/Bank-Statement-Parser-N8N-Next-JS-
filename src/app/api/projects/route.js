import { NextResponse } from "next/server";
import { createProject, getProjects, updateProject } from "@/lib/projects";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects failed", error);
    return NextResponse.json({ error: "Unable to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Require admin authentication
    const body = await request.json();
    const authError = await requireAdminAuth(request, body);
    if (authError) {
      return authError;
    }

    // Remove email/password from body if present (they were only for auth)
    const { email, password, ...projectData } = body;
    const created = await createProject(projectData);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects failed", error);
    const status = error.message?.includes("required")
      ? 400
      : error.message?.toLowerCase().includes("database unavailable")
      ? 503
      : 500;
    return NextResponse.json({ error: error.message || "Unable to create project" }, { status });
  }
}

export async function PUT(request) {
  try {
    // Require admin authentication
    const body = await request.json();
    const authError = await requireAdminAuth(request, body);
    if (authError) {
      return authError;
    }

    const { id, email, password, ...projectData } = body;
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const updated = await updateProject(id, projectData);
    return NextResponse.json({ project: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/projects failed", error);
    const status = error.message?.includes("required") || error.message?.includes("not found")
      ? 400
      : error.message?.toLowerCase().includes("database unavailable")
      ? 503
      : 500;
    return NextResponse.json({ error: error.message || "Unable to update project" }, { status });
  }
}

export async function PATCH(request) {
  // PATCH is an alias for PUT
  return PUT(request);
}

