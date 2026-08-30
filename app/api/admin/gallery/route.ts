import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { requireAdmin } from "@/lib/auth";

export async function GET() {
  // await requireAdmin();
  const images = await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
  return NextResponse.json({ images });
}

export async function POST(req: Request) {
  // await requireAdmin();
  const body = await req.json();
  const { imageUrl, caption, sortOrder } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const [image] = await db
    .insert(galleryImages)
    .values({ imageUrl, caption: caption ?? null, sortOrder: sortOrder ?? 0 })
    .returning();

  return NextResponse.json({ image }, { status: 201 });
}
