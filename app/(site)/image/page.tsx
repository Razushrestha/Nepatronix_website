import { connectToDatabase } from "@/lib/mongodb";
import { Gallery } from "@/lib/models";
import { resolveImageUrl } from "@/lib/content-image";
import GalleryClient, { type GalleryItem } from "./GalleryClient";

export const dynamic = "force-dynamic";

interface GalleryDoc {
  _id: unknown;
  title?: string;
  description?: string;
  images?: { url?: string; alt?: string; caption?: string }[];
}

async function getGalleryItems(): Promise<GalleryItem[]> {
  await connectToDatabase();
  const docs = await Gallery.find().sort({ publishedAt: -1, createdAt: -1 }).lean<GalleryDoc[]>();

  return docs.flatMap((doc) =>
    (doc.images || []).flatMap((img, index) => {
      const imageUrl = resolveImageUrl(img);
      if (!imageUrl) return [];
      return [
        {
          id: `${String(doc._id)}-${index}`,
          title: img.caption || doc.title || "Gallery image",
          description: doc.description || "",
          imageUrl,
        },
      ];
    })
  );
}

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <GalleryClient items={items} />;
}
