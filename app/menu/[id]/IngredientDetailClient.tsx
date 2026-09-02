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
    <div className="font-serif">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl tracking-[0.1em] text-[#F1E9D8]">{item.name}</h1>
          <p className="text-[#8A8172] mt-3 leading-relaxed">{item.description}</p>
        </div>
        <span className="text-lg text-[#C9A66B] whitespace-nowrap">
          ${(item.price / 100).toFixed(2)}
        </span>
      </div>

      {item.dietaryTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-4">
          {item.dietaryTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-wider px-2 py-0.5 rounded-full border border-[#3a3226] text-[#8A8172]"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      <h2 className="text-xs tracking-[0.3em] text-[#8A8172] mt-10 mb-3">INGREDIENTS</h2>
      <ul className="flex flex-wrap gap-2">
        {item.ingredients.map((ing) => (
          <li key={ing}>
            <button
              onClick={() => setSelected(ing)}
              className="text-sm px-4 py-2 rounded-full border border-[#3a3226] text-[#D8CBB0] hover:border-[#C9A66B] hover:text-[#F1E9D8] transition-colors"
            >
              {ing}
            </button>
          </li>
        ))}
      </ul>

      {selected && info && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#141210] border border-[#3a3226] rounded-sm p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg tracking-wide text-[#F1E9D8]">{selected}</h3>
            <p className="text-sm text-[#8A8172] mt-3 leading-relaxed">{info.description}</p>
            {info.origin && (
              <p className="text-xs text-[#C9A66B] mt-3 tracking-wide">{info.origin}</p>
            )}
            {info.allergen && (
              <p className="text-xs mt-2 text-[#D8CBB0]">{info.allergen}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="mt-6 text-xs tracking-[0.2em] text-[#8A8172] hover:text-[#F1E9D8] transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
