import { client } from "@/sanity/lib/client";
import BlogContent from "./BlogContent";
import type { Metadata } from "next";
import { canonicalBlogSlug } from "@/lib/blog/slugPath";

const SITE = "https://nepatronix.org";
const OG_DEFAULT = `${SITE}/og-banner.png`;

const postsListQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  publishedAt,
  readingTime,
  "categories": categories[],
  "tags": tags[],
  mainImage,
  author,
  slug
}`;

const postsMetaQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...60] {
  title,
  excerpt,
  publishedAt,
  "categories": categories[],
  "tags": tags[],
  "slug": slug.current
}`;

function slugFromPost(post: { slug?: { current?: string } | string }) {
  if (typeof post.slug === "string") return post.slug;
  return post.slug?.current ?? "";
}

function buildBlogIndexDescription(
  posts: { title: string; excerpt?: string }[]
): string {
  if (!posts?.length) {
    return "IoT, robotics, and STEM education articles, guides, and updates from Nepatronix in Nepal.";
  }
  const n = posts.length;
  const latest = posts[0];
  const tail =
    n > 1
      ? ` Browse ${n} articles on labs, training, and innovation in Nepal.`
      : " Hands-on STEM and engineering insights from Nepatronix.";
  const lead = `Latest: ${latest.title}.`;
  return `${lead}${tail}`.replace(/\s+/g, " ").trim().slice(0, 165);
}

function collectKeywordsFromPosts(
  posts: { categories?: string[]; tags?: string[] }[]
): string[] {
  const set = new Set<string>();
  for (const p of posts) {
    p.categories?.forEach((c) => {
      if (typeof c === "string" && c.trim()) set.add(c.trim());
    });
    p.tags?.forEach((t) => {
      if (typeof t === "string" && t.trim()) set.add(t.trim());
    });
  }
  const base = [
    "Nepatronix blog",
    "STEM education Nepal",
    "IoT Nepal",
    "Robotics Nepal",
    "engineering blog Nepal",
  ];
  return [...base, ...Array.from(set)].slice(0, 45);
}

export async function generateMetadata(): Promise<Metadata> {
  let metaPosts: {
    title: string;
    excerpt?: string;
    categories?: string[];
    tags?: string[];
  }[] = [];

  try {
    metaPosts = await client.fetch(postsMetaQuery, {}, { next: { revalidate: 120, tags: ["blog-list"] } });
  } catch {
    metaPosts = [];
  }

  const description = buildBlogIndexDescription(metaPosts);
  const keywords = collectKeywordsFromPosts(metaPosts);
  const count = metaPosts.length;
  const titleSegment =
    count > 0 ? `Blog & Insights (${count} articles)` : "Blog & Insights";

  return {
    title: titleSegment,
    description,
    keywords,
    authors: [{ name: "Nepatronix Engineering Solutions", url: SITE }],
    alternates: { canonical: `${SITE}/blog` },
    openGraph: {
      siteName: "Nepatronix",
      title: `${titleSegment} | Nepatronix`,
      description,
      url: `${SITE}/blog`,
      type: "website",
      images: [{ url: OG_DEFAULT, width: 1200, height: 630, alt: "Nepatronix blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleSegment} | Nepatronix`,
      description,
      images: [OG_DEFAULT],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const revalidate = 120;

export default async function BlogPage() {
  const rawPosts = await client.fetch(postsListQuery, {}, { next: { revalidate: 120, tags: ["blog-list"] } });
  const posts = rawPosts.flatMap((post: { slug?: { current?: string } | string }) => {
    const canon = canonicalBlogSlug(slugFromPost(post));
    if (!canon) return [];
    return [{ ...post, slug: { current: canon } }];
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nepatronix Blog",
    description: buildBlogIndexDescription(posts),
    url: `${SITE}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Nepatronix Engineering Solutions",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    blogPost: posts.map((post: { title: string; excerpt?: string; publishedAt?: string; slug?: { current?: string } | string }) => ({
      "@type": "BlogPosting",
      headline: post.title,
      name: post.title,
      description: post.excerpt?.replace(/\s+/g, " ").trim().slice(0, 300),
      url: `${SITE}/blog/${slugFromPost(post)}`,
      datePublished: post.publishedAt,
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepatronix blog articles",
    numberOfItems: posts.length,
    itemListElement: posts.map(
      (
        post: { title: string; slug?: { current?: string } | string },
        index: number
      ) => {
        const url = `${SITE}/blog/${slugFromPost(post)}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          item: {
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            url,
            headline: post.title,
          },
        };
      }
    ),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogContent initialPosts={posts} />
    </>
  );
}
