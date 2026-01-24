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

  const post: BlogPost | null = await client.fetch(query, { slug });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="relative bg-[#020617] px-6 pt-44 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#C1121F] uppercase tracking-[0.2em] animate-in fade-in duration-700">
            <span className="w-8 h-[2px] bg-[#C1121F]"></span>
            {post.categories?.[0] || "Update"}
            <span className="w-8 h-[2px] bg-[#C1121F]"></span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.2] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <p className="text-slate-600 italic">No content available for this post.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C1121F] to-red-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
              {post.author?.[0] || "A"}
            </div>
            <div>
              <p className="font-bold text-[#020617] text-lg">{post.author || "Nepatronix Team"}</p>
              <p className="text-[#C1121F] text-sm font-medium">Published in {post.categories?.[0] || "Updates"}</p>
            </div>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-[#C1121F] transition-all shadow-md hover:shadow-red-900/20"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
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
