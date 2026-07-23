import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { cache } from "react";
import ShareButtons from "./ShareButtons";
import SafeImage from "@/app/(site)/components/SafeImage";
import { canonicalBlogSlug } from "@/lib/blog/slugPath";
import {
  getAllBlogPosts,
  getBlogPostByCanonicalSlug,
  getRelatedBlogPosts,
  blogPostImageUrl,
  type BlogPostDoc,
} from "@/lib/blog/queries";
import { resolveImageUrl } from "@/lib/content-image";
import { BlogBody, hasBlogBody, blogBodyToPlainText } from "@/lib/portable-text";
import { authorJsonLd, findAuthorByName } from "@/lib/seo/authors";

const SITE = "https://nepatronix.org";
const OG_FALLBACK = `${SITE}/og-banner.png`;

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  _updatedAt?: string;
  readingTime: string;
  categories: string[];
  tags: string[];
  mainImage?: BlogPostDoc["mainImage"];
  ogImage?: BlogPostDoc["mainImage"];
  author: string;
  body: unknown;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface RawPostDoc extends BlogPostDoc {
  ogImage?: BlogPostDoc["mainImage"];
  canonicalUrl?: string;
  noIndex?: boolean;
}

function mapPostDoc(doc: BlogPostDoc): BlogPost {
  const raw = doc as RawPostDoc;
  return {
    _id: String(doc._id),
    title: doc.title || "",
    excerpt: doc.excerpt || "",
    publishedAt: doc.publishedAt
      ? new Date(doc.publishedAt).toISOString()
      : "",
    _updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
    readingTime: doc.readingTime || "",
    categories: doc.categories || [],
    tags: doc.tags || [],
    mainImage: doc.mainImage,
    ogImage: raw.ogImage,
    author: doc.author || "",
    body: doc.body ?? null,
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
    keywords: doc.keywords,
    canonicalUrl: raw.canonicalUrl || undefined,
    noIndex: !!raw.noIndex,
  };
}

const fetchBlogPostForCanonicalSlug = cache(async (canonicalSlug: string): Promise<BlogPost | null> => {
  const doc = await getBlogPostByCanonicalSlug(canonicalSlug);
  return doc ? mapPostDoc(doc) : null;
});

export const dynamicParams = true;

function normalizeSlugParam(raw: string | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;
  try {
    const s = decodeURIComponent(raw).trim();
    return s.length ? s : null;
  } catch {
    const s = raw.trim();
    return s.length ? s : null;
  }
}

/** Strip trailing brand so root `title.template` does not produce "… | Nepatronix | Nepatronix". */
function titleForMetadata(seoTitle: string | undefined, title: string) {
  const raw = (seoTitle || title || "Blog post").trim();
  return raw.replace(/\s*\|\s*Nepatronix(\s+Blog)?\s*$/i, "").trim() || title;
}

function metaDescription(seoDescription: string | undefined, excerpt: string | undefined) {
  const text = (seoDescription || excerpt || "Read this article on Nepatronix.").replace(/\s+/g, " ").trim();
  return text.slice(0, 165);
}

function ogDescription(seoDescription: string | undefined, excerpt: string | undefined) {
  const text = (seoDescription || excerpt || "Read this article on Nepatronix.").replace(/\s+/g, " ").trim();
  return text.slice(0, 200);
}

function dedupeKeywords(parts: (string | undefined)[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const p of parts) {
    if (typeof p !== "string") continue;
    const k = p.trim();
    if (!k || seen.has(k.toLowerCase())) continue;
    seen.add(k.toLowerCase());
    out.push(k);
    if (out.length >= 40) break;
  }
  return out;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const decoded = normalizeSlugParam(rawSlug);
  const slug = decoded ? canonicalBlogSlug(decoded) : null;
  if (!slug) {
    return { title: "Post Not Found", robots: { index: false, follow: false } };
  }

  const post = await fetchBlogPostForCanonicalSlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const mainImgUrl = post.mainImage ? blogPostImageUrl(post) : "";
  const ogImgUrl = post.ogImage
    ? resolveImageUrl(post.ogImage)
    : mainImgUrl || OG_FALLBACK;
  const canonicalUrl = post.canonicalUrl?.trim() || `${SITE}/blog/${slug}`;
  const titleBase = titleForMetadata(post.seoTitle, post.title);
  const description = metaDescription(post.seoDescription, post.excerpt);
  const ogDesc = ogDescription(post.seoDescription, post.excerpt);
  const brandedTitle = `${titleBase} | Nepatronix`;

  const keywordParts = [
    ...(Array.isArray(post.keywords) ? post.keywords : []),
    ...(post.categories || []),
    ...(post.tags || []),
    "Nepatronix",
    "Nepal",
    "STEM",
    "IoT",
    "Robotics",
  ];
  const keywords = dedupeKeywords(keywordParts);

  const ogImages = [
    {
      url: ogImgUrl,
      width: 1200,
      height: 630,
      alt: post.title,
    },
  ];

  const isIndexable = !post.noIndex;

  return {
    title: titleBase,
    description,
    keywords: keywords.length ? keywords : ["Nepatronix", "IoT Nepal", "STEM blog", "Robotics Nepal"],
    authors: [{ name: post.author || "Nepatronix Team", url: SITE }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      siteName: "Nepatronix",
      title: brandedTitle,
      description: ogDesc,
      url: canonicalUrl,
      images: ogImages,
      type: "article",
      locale: "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt || post.publishedAt,
      authors: [post.author || "Nepatronix Team"],
      section: post.categories?.[0],
      tags: keywords.slice(0, 20),
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description: ogDesc,
      images: [ogImgUrl],
    },
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
  };
}

export async function generateStaticParams() {
  try {
    const docs = await getAllBlogPosts();
    const out: { slug: string }[] = [];
    const seen = new Set<string>();
    for (const row of docs) {
      const canon = canonicalBlogSlug(row.slug || "");
      if (!canon || seen.has(canon)) continue;
      seen.add(canon);
      out.push({ slug: canon });
    }
    return out;
  } catch (err) {
    console.warn("Build: could not load blog slugs from MongoDB — pages will render on demand.", err);
    return [];
  }
}

export const revalidate = 60; // refresh detail pages periodically

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const decoded = normalizeSlugParam(rawSlug);
  const slug = decoded ? canonicalBlogSlug(decoded) : null;

  if (!slug) {
    notFound();
  }

  const post = await fetchBlogPostForCanonicalSlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post._id, post.categories || []);

  // JSON-LD Structured Data — rich Article schema pulling every SEO-relevant
  // field from the post: title, description, image, dates, author, publisher,
  // categories (articleSection), and the merged keyword set.
  const pageUrl = `https://nepatronix.org/blog/${slug}`;
  const canonicalPageUrl = post.canonicalUrl?.trim() || pageUrl;
  const articleDescription = metaDescription(post.seoDescription, post.excerpt);
  const articleKeywords = dedupeKeywords([
    ...(Array.isArray(post.keywords) ? post.keywords : []),
    ...(post.categories || []),
    ...(post.tags || []),
    "Nepatronix",
    "Nepal",
    "STEM",
    "IoT",
    "Robotics",
  ]);
  const articleImageUrl = post.mainImage ? blogPostImageUrl(post, OG_FALLBACK) : OG_FALLBACK;
  const plainBody = blogBodyToPlainText(post.body);
  const wordCount = plainBody ? plainBody.split(/\s+/).filter(Boolean).length : undefined;
  const articleBodySnippet = plainBody ? plainBody.slice(0, 500) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalPageUrl}#article`,
    url: canonicalPageUrl,
    headline: (post.title || "Nepatronix Blog Post").slice(0, 110),
    name: post.title,
    description: articleDescription,
    image: {
      "@type": "ImageObject",
      url: articleImageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    inLanguage: "en",
    articleSection: post.categories?.[0] || "Innovation",
    about: (post.categories || []).slice(0, 5).map((c) => ({ "@type": "Thing", name: c })),
    keywords: articleKeywords.join(", "),
    ...(wordCount ? { wordCount } : {}),
    ...(articleBodySnippet ? { articleBody: articleBodySnippet } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".prose p:first-of-type", ".blog-html-body p:first-of-type"],
    },
    "author": authorJsonLd(findAuthorByName(post.author)),
    "publisher": {
      "@type": "Organization",
      "@id": "https://nepatronix.org/#organization",
      "name": "Nepatronix Engineering Solutions",
      "url": SITE,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    isPartOf: {
      "@type": "Blog",
      name: "Nepatronix Blog",
      url: `${SITE}/blog`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${canonicalPageUrl}#webpage`,
      url: canonicalPageUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nepatronix.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://nepatronix.org/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://nepatronix.org/blog/${slug}`
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[110] h-1 bg-transparent">
        <div id="progress-bar" className="h-full bg-[#C1121F] w-0 transition-all duration-150 origin-left shadow-[0_0_10px_rgba(193,18,31,0.5)]"></div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `
        window.onscroll = function() {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scanned = (winScroll / height) * 100;
          document.getElementById("progress-bar").style.width = scanned + "%";
        };
      `}} />

      {/* Hero Section with Better Proportions */}
      <div className="relative bg-[#020617] px-6 pt-32 pb-24 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C1121F]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(white 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-[#C1121F] uppercase tracking-[0.4em] animate-in fade-in duration-700">
            <span className="w-8 h-[2px] bg-[#C1121F]"></span>
            {post.categories?.[0] || "Innovation"}
            <span className="w-8 h-[2px] bg-[#C1121F]"></span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 font-semibold uppercase tracking-[0.15em] animate-in fade-in duration-1000">
            <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recent Post"}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-500"></div>
            <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {post.readingTime || "5 min read"}
            </div>
            {post.author && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - White Background */}
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-24 relative z-20">
          {/* Featured Image - Perfectly Centered */}
          {post.mainImage && (
            <div className="relative -mt-12 mb-10 mx-auto max-w-3xl">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-2xl border border-slate-200 bg-slate-100 group">
              <SafeImage
                src={blogPostImageUrl(post, OG_FALLBACK)}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              />
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6 sm:p-10 md:p-14 lg:p-16">
          {hasBlogBody(post.body) ? (
            <div className="prose prose-lg prose-slate max-w-none 
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-p:text-slate-700 prose-p:leading-relaxed
              prose-a:text-[#C1121F] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900
              prose-ul:text-slate-700 prose-ol:text-slate-700
              prose-li:marker:text-[#C1121F]
              prose-blockquote:border-l-[#C1121F] prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-code:text-[#C1121F] prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-900
              prose-img:rounded-xl prose-img:shadow-lg
              [&_.blog-html-body_h2]:text-2xl [&_.blog-html-body_h2]:font-bold [&_.blog-html-body_h2]:text-slate-900 [&_.blog-html-body_h2]:mt-8 [&_.blog-html-body_h2]:mb-3
              [&_.blog-html-body_h3]:text-xl [&_.blog-html-body_h3]:font-bold [&_.blog-html-body_h3]:text-slate-900 [&_.blog-html-body_h3]:mt-6 [&_.blog-html-body_h3]:mb-2
              [&_.blog-html-body_p]:text-slate-700 [&_.blog-html-body_p]:leading-relaxed [&_.blog-html-body_p]:mb-4
              [&_.blog-html-body_ul]:list-disc [&_.blog-html-body_ul]:ml-6 [&_.blog-html-body_ul]:my-4
              [&_.blog-html-body_ol]:list-decimal [&_.blog-html-body_ol]:ml-6 [&_.blog-html-body_ol]:my-4
              [&_.blog-html-body_li]:text-slate-700 [&_.blog-html-body_li]:mb-1
              [&_.blog-html-body_blockquote]:border-l-4 [&_.blog-html-body_blockquote]:border-[#C1121F] [&_.blog-html-body_blockquote]:bg-slate-50 [&_.blog-html-body_blockquote]:pl-6 [&_.blog-html-body_blockquote]:py-4 [&_.blog-html-body_blockquote]:my-6
              [&_.blog-html-body_img]:rounded-xl [&_.blog-html-body_img]:shadow-lg [&_.blog-html-body_img]:my-8
              [&_.blog-html-body_a]:text-[#C1121F] [&_.blog-html-body_a]:font-medium hover:[&_.blog-html-body_a]:underline">
              <BlogBody value={post.body} />
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No content available for this post.</p>
          )}
        </div>

        {/* Author & Share Section */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 px-6 sm:px-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C1121F] to-[#8B0D16] flex items-center justify-center text-lg font-bold text-white shadow-lg">
              {post.author?.[0] || "N"}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#C1121F] uppercase tracking-[0.2em] mb-0.5">Written By</p>
              <p className="font-bold text-slate-900 text-lg">{post.author || "Nepatronix Team"}</p>
            </div>
          </div>
          
          <ShareButtons title={post.title} slug={slug} />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="pt-16 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[#C1121F] font-semibold uppercase tracking-[0.3em] text-[10px]">Continue Reading</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Related <span className="text-[#C1121F]">Articles</span></h2>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-[#C1121F] transition-all group">
                View All
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#C1121F] group-hover:border-transparent text-slate-500 group-hover:text-white transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const hrefSlug = related.slug.current;
                if (!hrefSlug) return null;
                return (
                <Link href={`/blog/${hrefSlug}`} key={related._id} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SafeImage
                      src={blogPostImageUrl(related, OG_FALLBACK)}
                      alt={related.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-semibold text-white bg-[#C1121F] px-2.5 py-1 rounded-full uppercase tracking-wider">{related.categories?.[0] || 'Article'}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#C1121F] transition-colors line-clamp-2 mb-2">
                      {related.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 flex-1">{related.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {related.readingTime || "5 min read"}
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
