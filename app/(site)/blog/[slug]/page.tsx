import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumb from "../../components/Breadcrumb";
import ShareButtons from "./ShareButtons";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  categories: string[];
  tags: string[];
  mainImage: any;
  author: string;
  body: any;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    seoTitle,
    seoDescription,
    keywords,
    "categories": categories[],
    "tags": tags[],
    mainImage,
    publishedAt,
    author
  }`;
  
  const post = await client.fetch(query, { slug });

  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "";
  const canonicalUrl = `https://nepatronix.org/blog/${slug}`;
  
  // Combine custom keywords with categories and tags for better SEO
  const allKeywords = [
    ...(post.keywords || []),
    ...(post.categories || []),
    ...(post.tags || [])
  ];

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "Read our latest blog post on Nepatronix.",
    keywords: allKeywords.length > 0 ? allKeywords : ["Robotics", "IoT", "Engineering", "Nepal"],
    authors: [{ name: post.author || "Nepatronix Team", url: "https://nepatronix.org" }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: canonicalUrl,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author || "Nepatronix Team"],
      tags: allKeywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: imageUrl ? [imageUrl] : [],
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

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    `*[_type == "post" && defined(slug.current)]{ slug }`
  );

  return slugs.map(({ slug }) => ({ slug: slug.current }));
}

export const revalidate = 60; // refresh detail pages periodically

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    publishedAt,
    readingTime,
    "categories": categories[],
    "tags": tags[],
    mainImage,
    author,
    body
  }`;

  const relatedQuery = `*[_type == "post" && slug.current != $slug && count(categories[@ in $categories]) > 0][0...3] {
    _id,
    title,
    excerpt,
    publishedAt,
    readingTime,
    "categories": categories[],
    mainImage,
    slug
  }`;

  const [post, relatedPosts]: [BlogPost | null, BlogPost[]] = await Promise.all([
    client.fetch(query, { slug }),
    client.fetch(relatedQuery, { slug, categories: [] }) 
  ]);

  if (!post) {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.mainImage ? urlFor(post.mainImage).width(1200).url() : "",
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author || "Nepatronix Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nepatronix",
      "url": "https://nepatronix.org",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nepatronix.org/logo.png" 
      }
    },
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://nepatronix.org/blog/${slug}`
    }
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

  // Refetch related posts with actual categories now that we have the post
  const actualRelatedPosts = await client.fetch(relatedQuery, { 
    slug, 
    categories: post.categories || [] 
  });

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
      
      <div className="relative z-[100] bg-[#020617]">
        <Breadcrumb />
      </div>

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
              <Image
                src={urlFor(post.mainImage).width(1200).url()}
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
          {post.body ? (
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
              prose-img:rounded-xl prose-img:shadow-lg">
              <PortableBody value={post.body} />
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
        {actualRelatedPosts.length > 0 && (
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
              {actualRelatedPosts.map((post: any) => (
                <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage).width(500).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-semibold text-white bg-[#C1121F] px-2.5 py-1 rounded-full uppercase tracking-wider">{post.categories?.[0] || 'Article'}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#C1121F] transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readingTime || "5 min read"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

// Portable Text renderer
import { PortableText, PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-8 overflow-hidden rounded-xl shadow-lg border border-slate-100">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || "Blog image"}
          width={1200}
          height={675}
          className="w-full h-auto"
        />
        {value.caption && (
          <p className="text-center text-sm text-slate-500 py-3 bg-slate-50 border-t border-slate-100">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold text-slate-900 mt-10 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold text-slate-900 mt-5 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#C1121F] bg-slate-50 pl-6 pr-4 py-4 my-6 rounded-r-lg italic text-slate-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a 
        href={value?.href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#C1121F] hover:underline font-medium"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-slate-100 text-[#C1121F] px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 text-slate-700 ml-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-4 text-slate-700 ml-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-slate-700">{children}</li>,
    number: ({ children }) => <li className="text-slate-700">{children}</li>,
  },
};

function PortableBody({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
