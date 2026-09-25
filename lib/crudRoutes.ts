import { NextRequest, NextResponse } from "next/server";
import { getRepo, type CollectionName, type SortMode } from "@/lib/repo";
import { requireAdmin } from "@/lib/apiAuth";

type ItemContext = { params: Promise<{ id: string }> };

export function serverError(err: unknown) {
  console.error(err);
  return NextResponse.json({ error: "Database error" }, { status: 500 });
}

export function collectionRoutes(
  collection: CollectionName,
  { publicRead = false, sort = "order" }: { publicRead?: boolean; sort?: SortMode } = {}
) {
  async function GET() {
    if (!publicRead) {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;
    }
    try {
      const repo = await getRepo();
      return NextResponse.json(await repo.list(collection, sort));
    } catch (err) {
      return serverError(err);
    }
  }

  async function POST(req: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    try {
      const repo = await getRepo();
      return NextResponse.json(await repo.create(collection, await req.json()), { status: 201 });
    } catch (err) {
      return serverError(err);
    }
  }

  return { GET, POST };
}

export function itemRoutes(collection: CollectionName) {
  async function PUT(req: NextRequest, { params }: ItemContext) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    try {
      const { id } = await params;
      const repo = await getRepo();
      const doc = await repo.update(collection, id, await req.json());
      return doc ? NextResponse.json(doc) : NextResponse.json({ error: "Not found" }, { status: 404 });
    } catch (err) {
      return serverError(err);
    }
  }

  async function DELETE(_req: NextRequest, { params }: ItemContext) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    try {
      const { id } = await params;
      const repo = await getRepo();
      await repo.remove(collection, id);
      return NextResponse.json({ success: true });
    } catch (err) {
      return serverError(err);
    }
  }

  return { PUT, PATCH: PUT, DELETE };
}
