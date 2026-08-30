import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import Image from "next/image";

export default async function GalleryPage() {
  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder));

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Gallery</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((img) => (
          <figure key={img.id} className="rounded-lg overflow-hidden border">
            <div className="relative aspect-[4/3]">
              <Image
                src={img.imageUrl}
                alt={img.caption ?? ""}
                fill
                className="object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="text-sm text-muted-foreground p-2">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </main>
  );
}
