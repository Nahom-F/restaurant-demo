import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold">The Cafe</h1>
      <p className="text-muted-foreground mt-3">
        A demo restaurant/cafe site — browse the menu, take a look around, or reserve a table.
      </p>
      <div className="flex gap-4 justify-center mt-8 flex-wrap">
        <Link href="/menu" className="underline font-medium">
          View Menu
        </Link>
        <Link href="/gallery" className="underline font-medium">
          Gallery
        </Link>
        <Link href="/reservations" className="underline font-medium">
          Reservations
        </Link>
      </div>
    </main>
  );
}
