import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  drinks: "Drinks",
  desserts: "Desserts",
};

const CATEGORY_ORDER = ["breakfast", "lunch", "dinner", "drinks", "desserts"];

export default async function MenuPage() {
  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.available, true));

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: items.filter((i) => i.category === cat),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Menu</h1>

      {grouped.map((group) => (
        <section key={group.category} className="mb-10">
          <h2 className="text-xl font-medium mb-4 border-b pb-2">{group.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.id}
                href={`/menu/${item.id}`}
                className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ${(item.price / 100).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                {item.dietaryTags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
