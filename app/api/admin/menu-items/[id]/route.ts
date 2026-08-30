import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { requireAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // await requireAdmin();
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, Number(params.id)));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // await requireAdmin();
  const body = await req.json();
  const id = Number(params.id);

  const { name, description, price, category, ingredients, dietaryTags, imageUrl, available } = body;

  const [item] = await db
    .update(menuItems)
    .set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(category !== undefined && { category }),
      ...(ingredients !== undefined && { ingredients }),
      ...(dietaryTags !== undefined && { dietaryTags }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(available !== undefined && { available }),
      updatedAt: new Date(),
    })
    .where(eq(menuItems.id, id))
    .returning();

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // await requireAdmin();
  const id = Number(params.id);
  const [item] = await db.delete(menuItems).where(eq(menuItems.id, id)).returning();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
