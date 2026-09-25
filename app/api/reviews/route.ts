import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRepo } from "@/lib/repo";
import { collectionRoutes, serverError } from "@/lib/crudRoutes";

export const { POST } = collectionRoutes("reviews");

// Unapproved drafts are visible to the admin only.
export async function GET() {
  try {
    const [session, repo] = await Promise.all([getServerSession(authOptions), getRepo()]);
    const reviews = await repo.list("reviews");
    return NextResponse.json(session ? reviews : reviews.filter((r) => r.published !== false));
  } catch (err) {
    return serverError(err);
  }
}
