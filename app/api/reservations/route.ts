import { db } from "@/db";
import { reservations } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, phone, partySize, date, notes } = body;

  if (!name || !email || !partySize || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [reservation] = await db
    .insert(reservations)
    .values({
      name,
      email,
      phone: phone || null,
      partySize: Number(partySize),
      date: new Date(date),
      notes: notes || null,
    })
    .returning();

  // No notification wiring for this demo — just persists.
  // A real build would fire an email/SMS confirmation here (same pattern
  // as EcoFurnish's Resend-based order status emails).

  return NextResponse.json({ reservation }, { status: 201 });
}
