import { NextRequest, NextResponse } from "next/server";
import { getRepo } from "@/lib/repo";
import { requireAdmin } from "@/lib/apiAuth";
import { serverError } from "@/lib/crudRoutes";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const repo = await getRepo();
    return NextResponse.json(await repo.getProfile());
  } catch (err) {
    return serverError(err);
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const repo = await getRepo();
    return NextResponse.json(await repo.saveProfile(await req.json()));
  } catch (err) {
    return serverError(err);
  }
}
