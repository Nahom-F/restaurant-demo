"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BookingCountdown from "../components/BookingCountdown";

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

  return (
    <main className="relative min-h-screen text-[#E8E2D6]">
      {/* background photo */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/reservation-bg.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ filter: "brightness(0.4) saturate(0.85)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.85) 100%)",
          }}
        />
      </div>

      <div className="px-6 py-16 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="font-serif text-xs tracking-[0.3em] text-[#C9A66B] hover:text-[#F1E9D8] transition-colors"
          >
            ← AHADU
          </Link>

          <div className="grid md:grid-cols-5 gap-16 mt-12">
            {/* form */}
            <div className="md:col-span-3">
              <h1 className="font-serif text-4xl tracking-[0.15em] mb-6">RESERVE A TABLE</h1>

              <div className="mb-10">
                <BookingCountdown />
              </div>

              {submitted ? (
                <div className="border border-[#C9A66B]/30 rounded-sm p-8 bg-[#0a0a0a]/40">
                  <h2 className="font-serif text-xl tracking-wide text-[#F1E9D8]">
                    Reservation received
                  </h2>
                  <p className="text-[#8A8172] mt-3 font-serif">
                    Thank you — we've saved your request and will be in touch to confirm.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 font-serif">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-[0.2em] text-[#8A8172]">NAME</label>
                      <input
                        name="name"
                        required
                        className="w-full bg-transparent border-b border-[#3a3226] focus:border-[#C9A66B] outline-none py-2 mt-1 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.2em] text-[#8A8172]">EMAIL</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full bg-transparent border-b border-[#3a3226] focus:border-[#C9A66B] outline-none py-2 mt-1 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-[0.2em] text-[#8A8172]">PHONE (OPTIONAL)</label>
                      <input
                        name="phone"
                        className="w-full bg-transparent border-b border-[#3a3226] focus:border-[#C9A66B] outline-none py-2 mt-1 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.2em] text-[#8A8172]">PARTY SIZE</label>
                      <input
                        name="partySize"
                        type="number"
                        min={1}
                        required
                        className="w-full bg-transparent border-b border-[#3a3226] focus:border-[#C9A66B] outline-none py-2 mt-1 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs tracking-[0.2em] text-[#8A8172]">DATE & TIME</label>
                    <input
                      name="date"
                      type="datetime-local"
                      required
                      className="w-full bg-transparent border-b border-[#3a3226] focus:border-[#C9A66B] outline-none py-2 mt-1 transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-[0.2em] text-[#8A8172]">NOTES (OPTIONAL)</label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full bg-transparent border-b border-[#3a3226] focus:border-[#C9A66B] outline-none py-2 mt-1 transition-colors resize-none"
                    />
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 border border-[#C9A66B] text-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#0a0a0a] tracking-[0.25em] text-sm px-8 py-3 transition-colors disabled:opacity-50"
                  >
                    {loading ? "SUBMITTING..." : "REQUEST RESERVATION"}
                  </button>
                </form>
              )}
            </div>

            {/* visit us panel */}
            <div className="md:col-span-2 font-serif">
              <h2 className="text-xs tracking-[0.3em] text-[#8A8172] mb-6">VISIT US</h2>

              <div className="space-y-6 text-[#D8CBB0]">
                <div>
                  <h3 className="text-[#C9A66B] text-sm tracking-[0.15em] mb-1">HOURS</h3>
                  <p className="text-sm leading-relaxed">
                    [Add hours]
                  </p>
                </div>

                <div>
                  <h3 className="text-[#C9A66B] text-sm tracking-[0.15em] mb-1">LOCATION</h3>
                  <p className="text-sm leading-relaxed">
                    Bole, Addis Ababa, Ethiopia
                  </p>
                </div>

                <div>
                  <h3 className="text-[#C9A66B] text-sm tracking-[0.15em] mb-1">CONTACT</h3>
                  <p className="text-sm leading-relaxed">
                    +251 91 234 5678
                    <br />
                    [Add email address]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
