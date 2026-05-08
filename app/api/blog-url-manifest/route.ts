import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { canonicalBlogSlug } from "@/lib/blog/slugPath";

const baseUrl = "https://nepatronix.org";

/** Same freshness window as /sitemap.xml blog section. */
export const revalidate = 120;

/**
 * Machine-readable list of published blog URLs with titles.
 * Standard sitemap.xml cannot include titles; use this alongside Search Console.
 */
export async function GET() {
  const posts = await client.fetch<
    {
      title: string;
      slug: string;
      publishedAt?: string;
      _updatedAt?: string;
    }[]
  >(
    `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
      title,
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`,
    {},
    { next: { revalidate: 120, tags: ["blog-list", "sitemap"] } }
  );

  const items: { title: string; url: string; lastModified: string | null }[] = [];

  for (const p of posts || []) {
    const slug = canonicalBlogSlug(typeof p.slug === "string" ? p.slug : "");
    if (!slug) continue;
    const lm = p._updatedAt || p.publishedAt || null;
    items.push({
      title: typeof p.title === "string" ? p.title : "Untitled",
      url: `${baseUrl}/blog/${slug}`,
      lastModified: lm ?? null,
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
