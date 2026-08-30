import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
// import { requireAdmin } from "@/lib/auth"; // wire up to your existing admin auth, same as EcoFurnish

export async function GET() {
  // await requireAdmin();
  const items = await db.select().from(menuItems).orderBy(desc(menuItems.createdAt));
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  // await requireAdmin();
  const body = await req.json();

  const { name, description, price, category, ingredients, dietaryTags, imageUrl, available } = body;

  if (!name || !description || price == null || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [item] = await db
    .insert(menuItems)
    .values({
      name,
      description,
      price: Number(price),
      category,
      ingredients: ingredients ?? [],
      dietaryTags: dietaryTags ?? [],
      imageUrl: imageUrl ?? null,
      available: available ?? true,
    })
    .returning();

  return NextResponse.json({ item }, { status: 201 });
}
