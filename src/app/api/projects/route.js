import { NextResponse } from "next/server";
import { createProject, getProjects } from "@/lib/projects";

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
    const body = await request.json();
    const created = await createProject(body);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects failed", error);
    const status = error.message?.includes("required") ? 400 : 500;
    return NextResponse.json({ error: error.message || "Unable to create project" }, { status });
  }
}

