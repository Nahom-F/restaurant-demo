import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // await requireAdmin();
  const body = await req.json();
  const id = Number(params.id);
  const { imageUrl, caption, sortOrder } = body;

  const [image] = await db
    .update(galleryImages)
    .set({
      ...(imageUrl !== undefined && { imageUrl }),
      ...(caption !== undefined && { caption }),
      ...(sortOrder !== undefined && { sortOrder }),
    })
    .where(eq(galleryImages.id, id))
    .returning();

  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ image });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // await requireAdmin();
  const id = Number(params.id);
  const [image] = await db.delete(galleryImages).where(eq(galleryImages.id, id)).returning();
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
