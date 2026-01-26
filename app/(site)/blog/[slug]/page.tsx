import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumb from "../../components/Breadcrumb";

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
    mainImage
  }`;
  
  const post = await client.fetch(query, { slug });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "";
  const canonicalUrl = `https://nepatronix.com/blog/${slug}`;
  
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
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: canonicalUrl,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: imageUrl ? [imageUrl] : [],
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
      "url": "https://nepatronix.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nepatronix.com/logo.png" 
      }
    },
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://nepatronix.com/blog/${slug}`
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
        "item": "https://nepatronix.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://nepatronix.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://nepatronix.com/blog/${slug}`
      }
    ]
  };

  // Refetch related posts with actual categories now that we have the post
  const actualRelatedPosts = await client.fetch(relatedQuery, { 
    slug, 
    categories: post.categories || [] 
  });

  return (
    <div className="bg-[#020617] min-h-screen text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <div className="relative z-[100]">
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

      <div className="relative bg-[#020617] px-6 pt-44 pb-32 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C1121F]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(white 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-4 text-[10px] font-black text-[#C1121F] uppercase tracking-[0.5em] animate-in fade-in duration-700">
            <span className="w-12 h-[2px] bg-[#C1121F]"></span>
            {post.categories?.[0] || "Innovation"}
            <span className="w-12 h-[2px] bg-[#C1121F]"></span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 italic">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-8 text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] animate-in fade-in duration-1000">
            <div className="flex items-center gap-3">
               <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recent Post"}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="flex items-center gap-3">
               <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {post.readingTime || "5 min read"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24 space-y-12 relative z-20">
        {post.mainImage && (
          <div className="relative -mt-24 aspect-[21/9] w-full overflow-hidden rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 z-20 bg-slate-900 group">
            <Image
              src={urlFor(post.mainImage).width(1600).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-[3s] group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-20 prose prose-invert prose-slate max-w-none shadow-2xl border border-white/10">
          {post.body ? (
            <div className="text-slate-300 leading-[1.8] space-y-8 text-lg font-medium">
              <PortableBody value={post.body} />
            </div>
          ) : (
            <p className="text-slate-400">No content available for this post.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#C1121F] flex items-center justify-center text-xl font-black text-white shadow-2xl rotate-3 border border-white/10">
              {post.author?.[0] || "N"}
            </div>
            <div>
              <p className="text-[10px] font-black text-[#C1121F] uppercase tracking-[0.3em] mb-1">Curated By</p>
              <p className="font-bold text-white text-2xl tracking-tight">{post.author || "Nepatronix Team"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">Share Story:</span>
             {[
               { icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", name: "X" },
               { icon: "M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z", name: "LinkedIn" }
             ].map((social) => (
                <button key={social.name} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#C1121F] hover:text-white transition-all duration-300 hover:-translate-y-2 group shadow-xl">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </button>
             ))}
          </div>
        </div>

        {/* Related Posts */}
        {actualRelatedPosts.length > 0 && (
          <div className="pt-32 space-y-16">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <p className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Next Chapter</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight italic">You Might Also <span className="text-[#C1121F]">Explore</span></h2>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[#C1121F] transition-all group">
                Back to Journal
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C1121F] group-hover:border-transparent transition-all">
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {actualRelatedPosts.map((post: any) => (
                <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex flex-col h-full bg-white/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl hover:shadow-[#C1121F]/10 hover:-translate-y-3 transition-all duration-700">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage).width(600).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60"></div>
                  </div>
                  <div className="p-8">
                    <span className="text-[9px] font-black text-[#C1121F] uppercase tracking-[0.3em] block mb-3">{post.categories?.[0] || 'Article'}</span>
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-[#C1121F] transition-colors line-clamp-2 uppercase tracking-tight">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Portable Text renderer
import { PortableText, PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-6 overflow-hidden rounded-2xl shadow-sm">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || "Blog image"}
          width={1200}
          height={675}
          className="w-full h-auto"
        />
      </div>
    ),
  },
};

function PortableBody({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
