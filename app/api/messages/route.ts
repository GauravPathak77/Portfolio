import { NextRequest, NextResponse } from "next/server";
import { getRepo } from "@/lib/repo";
import { collectionRoutes, serverError } from "@/lib/crudRoutes";

export const { GET } = collectionRoutes("messages", { sort: "newest" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const field = (key: string) => (typeof body[key] === "string" ? body[key].trim().slice(0, 5000) : "");
    const message = {
      name: field("name"),
      email: field("email"),
      subject: field("subject"),
      message: field("message"),
      read: false,
    };

    if (!message.name || !message.email || !message.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const repo = await getRepo();
    return NextResponse.json(await repo.create("messages", message), { status: 201 });
  } catch (err) {
    return serverError(err);
  }
}
