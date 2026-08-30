"use client";

import { useState } from "react";
import { getIngredientInfo } from "@/lib/ingredient-info";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  dietaryTags: string[];
  imageUrl: string | null;
};

export default function IngredientDetailClient({ item }: { item: MenuItem }) {
  const [selected, setSelected] = useState<string | null>(null);
  const info = selected ? getIngredientInfo(selected) : null;

  return (
    <div>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="text-muted-foreground mt-1">{item.description}</p>
        </div>
        <span className="text-lg font-medium whitespace-nowrap">
          ${(item.price / 100).toFixed(2)}
        </span>
      </div>

      {item.dietaryTags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-3">
          {item.dietaryTags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h2 className="text-sm font-medium mt-6 mb-2 text-muted-foreground">Ingredients</h2>
      <ul className="flex flex-wrap gap-2">
        {item.ingredients.map((ing) => (
          <li key={ing}>
            <button
              onClick={() => setSelected(ing)}
              className="text-sm px-3 py-1.5 rounded-full border hover:bg-muted transition-colors"
            >
              {ing}
            </button>
          </li>
        ))}
      </ul>

      {selected && info && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-background rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-medium text-lg">{selected}</h3>
            <p className="text-sm text-muted-foreground mt-2">{info.description}</p>
            {info.origin && (
              <p className="text-xs text-muted-foreground mt-2">{info.origin}</p>
            )}
            {info.allergen && (
              <p className="text-xs mt-2 font-medium">{info.allergen}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-sm underline text-muted-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
