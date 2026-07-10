import { NextResponse } from "next/server";
import { canonicalBlogSlug } from "@/lib/blog/slugPath";
import { getAllBlogPosts } from "@/lib/blog/queries";

const baseUrl = "https://nepatronix.org";

export const revalidate = 120;

export async function GET() {
  const docs = await getAllBlogPosts();
  const items: { title: string; url: string; lastModified: string | null }[] = [];

  for (const post of docs) {
    const slug = canonicalBlogSlug(post.slug || "");
    if (!slug) continue;
    const lm = post.updatedAt || post.publishedAt || null;
    items.push({
      title: typeof post.title === "string" ? post.title : "Untitled",
      url: `${baseUrl}/blog/${slug}`,
      lastModified: lm ? new Date(lm).toISOString() : null,
    });
  }

  return NextResponse.json(
    {
      note: "Titles are not valid in sitemap.xml; this JSON mirrors blog URLs in /sitemap.xml with titles for your tooling.",
      generatedAt: new Date().toISOString(),
      count: items.length,
      posts: items,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    }
  );
}
