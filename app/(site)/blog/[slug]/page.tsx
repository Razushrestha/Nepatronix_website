import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  categories: string[];
  mainImage: any;
  author: string;
  body: any;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    mainImage
  }`;
  
  const post = await client.fetch(query, { slug });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "";

  return {
    title: post.title,
    description: post.excerpt || "Read our latest blog post on Nepatronix.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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
    "categories": categories[]->title,
    mainImage,
    author,
    body
  }`;

  const relatedQuery = `*[_type == "post" && slug.current != $slug && count(categories[@->title in $categories]) > 0][0...3] {
    _id,
    title,
    excerpt,
    publishedAt,
    readingTime,
    "categories": categories[]->title,
    mainImage,
    slug
  }`;

  const [post, relatedPosts]: [BlogPost | null, BlogPost[]] = await Promise.all([
    client.fetch(query, { slug }),
    client.fetch(relatedQuery, { slug, categories: [] }) // We'll refine categories below
  ]);

  if (!post) {
    notFound();
  }

  // Refetch related posts with actual categories now that we have the post
  const actualRelatedPosts = await client.fetch(relatedQuery, { 
    slug, 
    categories: post.categories || [] 
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1.5 bg-transparent">
        <div id="progress-bar" className="h-full bg-[#C1121F] w-0 transition-all duration-150 origin-left"></div>
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
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C1121F]/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#C1121F] uppercase tracking-[0.3em] animate-in fade-in duration-700">
            <span className="w-10 h-[2px] bg-[#C1121F]"></span>
            {post.categories?.[0] || "Innovation"}
            <span className="w-10 h-[2px] bg-[#C1121F]"></span>
          </div>
          
<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.2] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-300 font-medium animate-in fade-in duration-1000">
            <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recent Post"}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {post.readingTime || "5 min read"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24 space-y-12">
        {post.mainImage && (
          <div className="relative -mt-16 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white z-20 bg-slate-100">
            <Image
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 md:p-16 prose prose-slate max-w-none shadow-xl shadow-slate-200/50 border border-slate-100">
          {post.body ? (
            <div className="text-slate-700 leading-relaxed space-y-6 text-lg">
              <PortableBody value={post.body} />
            </div>
          ) : (
            <p className="text-slate-600">No content available for this post.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#020617] to-slate-800 flex items-center justify-center text-xl font-bold text-white shadow-xl rotate-3">
              {post.author?.[0] || "N"}
            </div>
            <div>
              <p className="text-sm font-bold text-[#C1121F] uppercase tracking-widest mb-1">Author</p>
              <p className="font-bold text-[#020617] text-xl tracking-tight">{post.author || "Nepatronix Team"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-slate-400 mr-2">Share:</span>
             {[
               { icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", name: "X" },
               { icon: "M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z", name: "LinkedIn" }
             ].map((social) => (
                <button key={social.name} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#C1121F] hover:text-[#C1121F] transition-all hover:-translate-y-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </button>
             ))}
          </div>
        </div>

        {/* Related Posts */}
        {actualRelatedPosts.length > 0 && (
          <div className="pt-24 space-y-12">
            <div className="flex items-end justify-between border-b-2 border-slate-100 pb-8">
              <div className="space-y-2">
                <p className="text-[#C1121F] font-bold uppercase tracking-widest text-sm">Next Read</p>
                <h2 className="text-3xl font-bold text-[#020617] tracking-tight">You Might Also <span className="text-[#C1121F]">Like</span></h2>
              </div>
              <Link href="/blog" className="text-sm font-bold text-slate-500 hover:text-[#C1121F] transition-colors flex items-center gap-2 group">
                View all stories
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {actualRelatedPosts.map((post: any) => (
                <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage).width(600).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-[#C1121F] uppercase tracking-widest block mb-2">{post.categories?.[0] || 'Article'}</span>
                    <h3 className="text-lg font-bold text-[#020617] leading-snug group-hover:text-[#C1121F] transition-colors line-clamp-2">
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
