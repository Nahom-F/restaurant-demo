"use client";

import { useState } from "react";

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      partySize: Number(form.get("partySize")),
      date: form.get("date"),
      notes: form.get("notes"),
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to submit reservation");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Reservation received</h1>
        <p className="text-muted-foreground mt-2">
          Thanks — we've saved your request. We'll be in touch to confirm.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Reserve a table</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input name="name" required className="w-full border rounded-md p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input name="email" type="email" required className="w-full border rounded-md p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Phone (optional)</label>
          <input name="phone" className="w-full border rounded-md p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Party size</label>
          <input
            name="partySize"
            type="number"
            min={1}
            required
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Date & time</label>
          <input
            name="date"
            type="datetime-local"
            required
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Notes (optional)</label>
          <textarea name="notes" className="w-full border rounded-md p-2 mt-1" rows={3} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background rounded-md py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request reservation"}
        </button>
      </form>
    </main>
  );
}
