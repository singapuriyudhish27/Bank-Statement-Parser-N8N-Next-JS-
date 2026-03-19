import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/projects";

export async function GET(request, { params }) {
  try {
    // Handle params - in Next.js 16, params might be a Promise
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;
    
    console.log("GET /api/projects/[id] - params:", resolvedParams, "id:", id);
    
    if (!id) {
      console.error("Project ID is missing from params");
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    console.log("Fetching project with ID:", id);
    const project = await getProjectById(id);
    
    if (!project) {
      console.log("Project not found for ID:", id);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("Project found:", project.id);
    return NextResponse.json({ project });
  } catch (error) {
    console.error("GET /api/projects/[id] failed", error);
    return NextResponse.json({ 
      error: error.message || "Unable to fetch project",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
