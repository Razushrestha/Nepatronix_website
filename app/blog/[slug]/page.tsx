import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

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
      <div className="relative bg-[#020617] px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#C1121F] uppercase tracking-[0.2em]">
            <span className="w-8 h-[2px] bg-[#C1121F]"></span>
            {post.categories?.[0] || "Blog"}
            <span className="w-8 h-[2px] bg-[#C1121F]"></span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-gray-300">
            {new Date(post.publishedAt).toLocaleDateString()} • {post.readingTime || "Read"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        {post.mainImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-lg bg-slate-100">
            <Image
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 prose prose-slate max-w-none shadow-xl shadow-slate-200/50">
          {post.body ? (
            <div className="text-slate-700 leading-relaxed space-y-6">
              <PortableBody value={post.body} />
            </div>
          ) : (
            <p className="text-slate-600">No content available.</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-[#020617]">
              {post.author?.[0] || "A"}
            </div>
            <div>
              <p className="font-bold text-[#020617]">{post.author}</p>
              <p className="text-slate-500">Author</p>
            </div>
          </div>
          <Link href="/blog" className="text-[#C1121F] font-bold hover:underline">
            ← Back to Blog
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
