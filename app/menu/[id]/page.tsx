import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import IngredientDetailClient from "./IngredientDetailClient";

export default async function MenuItemPage({
  params,
}: {
  params: { id: string };
}) {
  const [item] = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.id, Number(params.id)));

  if (!item) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <IngredientDetailClient item={item} />
    </main>
  );
}
