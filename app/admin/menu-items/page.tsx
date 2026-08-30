"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  dietaryTags: string[];
  available: boolean;
};

const CATEGORIES = ["breakfast", "lunch", "dinner", "drinks", "desserts"];
const DIETARY_TAGS = ["vegetarian", "vegan", "spicy", "gluten-free"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "breakfast",
  ingredients: "",
  dietaryTags: [] as string[],
  available: true,
};

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/menu-items");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: (item.price / 100).toString(),
      category: item.category,
      ingredients: item.ingredients.join(", "),
      dietaryTags: item.dietaryTags,
      available: item.available,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      dietaryTags: f.dietaryTags.includes(tag)
        ? f.dietaryTags.filter((t) => t !== tag)
        : [...f.dietaryTags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      category: form.category,
      ingredients: form.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      dietaryTags: form.dietaryTags,
      available: form.available,
    };

    if (editingId) {
      await fetch(`/api/admin/menu-items/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    resetForm();
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Admin — Menu Items</h1>

      <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-8 space-y-3">
        <h2 className="font-medium">{editingId ? "Edit item" : "Add new item"}</h2>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-md p-2"
          />
          <input
            placeholder="Price (e.g. 12.00)"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-md p-2"
          />
        </div>

        <textarea
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-md p-2"
          rows={2}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded-md p-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          placeholder="Ingredients (comma-separated)"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          className="w-full border rounded-md p-2"
        />

        <div className="flex gap-3 flex-wrap">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag} className="text-sm flex items-center gap-1">
              <input
                type="checkbox"
                checked={form.dietaryTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>

        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          Available on menu
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Add item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-muted-foreground underline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-3 flex justify-between items-center gap-4"
            >
              <div>
                <div className="font-medium flex items-center gap-2">
                  {item.name}
                  {!item.available && (
                    <span className="text-xs text-muted-foreground">(hidden)</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.category} · ${(item.price / 100).toFixed(2)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(item)}
                  className="text-sm underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
