"use client";

import { urlFor } from "@/sanity/lib/image";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  categories: string[];
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  author: string;
  slug: {
    current: string;
  };
}

interface BlogContentProps {
  initialPosts: BlogPost[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const [displayCount, setDisplayCount] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = initialPosts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.categories?.some(cat => cat?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = initialPosts[0];

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently Published";
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getTime() === 0) return "Recently Published";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateText = (text: string, wordLimit: number = 40) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  if (!featuredPost) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
        <div className="h-full bg-[#C1121F] w-0 transition-all duration-300" id="reading-progress"></div>
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const bar = document.getElementById('reading-progress');
            if (bar) bar.style.width = scrolled + '%';
          });
        `
      }} />

      {/* Modern Hero Section (Midnight Tech) */}
      <div className="relative bg-[#020617] pt-48 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#C1121F]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(white 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="h-[2px] w-12 bg-[#C1121F]"></span>
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Our Journal</span>
              <span className="h-[2px] w-12 bg-[#C1121F]"></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Exploring the <span className="text-[#C1121F]">Future</span> <br className="hidden md:block" /> of Technology.
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 font-medium">
              Insights from the heart of Nepal's tech scene. From robotics breakthroughs to educational strategies, discover what moves us.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-12 relative z-20 pb-24">
        <div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 mb-12">
            {/* Featured Bento Card */}
            <Link href={`/blog/${featuredPost.slug.current}`} className="lg:col-span-8 group relative block h-[450px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-700 hover:-translate-y-2">
              <Image
                src={urlFor(featuredPost.mainImage).width(1600).url()}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                priority
              />
              
              {/* High-end Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-16">
                <div className="max-w-3xl space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-3 bg-[#C1121F] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-900/40 border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Featured Story
                    </span>
                    <span className="text-white/60 text-[11px] font-black uppercase tracking-[0.4em]">{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight group-hover:text-red-400 transition-colors duration-500 italic">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-slate-300 text-base md:text-lg line-clamp-2 font-medium leading-relaxed opacity-80 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#C1121F] flex items-center justify-center text-sm font-black text-white shadow-2xl rotate-3 border border-white/10">
                      {featuredPost.author?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#C1121F] uppercase tracking-widest leading-none mb-1">Lead Curator</span>
                      <span className="text-base font-bold text-white tracking-tight">{featuredPost.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sidebar Recent Grid */}
            <div className="lg:col-span-4 h-full flex flex-col">
              <div className="flex-1 bg-gray-50 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-gray-200 flex flex-col h-[340px] lg:h-[400px]">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight italic">
                    Recent <span className="text-[#C1121F]">Stories</span>
                  </h3>
                  <div className="h-1 w-6 bg-[#C1121F] rounded-full" />
                </div>
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {initialPosts.slice(1, 8).map((post) => (
                    <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-lg transition-all duration-700 border border-gray-200">
                        <Image src={urlFor(post.mainImage).width(150).url()} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-[#C1121F] font-black uppercase tracking-[0.2em] leading-none">
                          {post.categories?.[0] || 'Update'}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#C1121F] transition-colors line-clamp-2 leading-tight tracking-tight uppercase">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <button onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })} className="flex items-center justify-center w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#C1121F] hover:text-white transition-all duration-500 group/btn border border-gray-200 shadow">
                    <span>Explore Archive</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Search Bar */}
        <div className="mb-24 max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#C1121F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by keywords, categories, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 py-5 pl-16 pr-8 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C1121F] focus:ring-4 focus:ring-red-500/10 transition-all shadow-lg text-lg font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-[#C1121F] transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-widest mr-2">Clear</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Robotics', 'AI', 'Innovation', 'Education'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[#C1121F] hover:text-white transition-all border border-gray-200 hover:border-transparent"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight italic">
            {searchQuery ? (
              <>Search results for <span className="text-[#C1121F]">"{searchQuery}"</span></>
            ) : (
              <>Latest <span className="text-[#C1121F]">Articles</span></>
            )}
          </h2>
          <div className="h-px flex-1 bg-gray-200 mx-10 hidden md:block"></div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#C1121F]">
            {searchQuery ? `${filteredPosts.length} Found` : 'Archive'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.length > 0 ? (
            filteredPosts.slice(0, displayCount).map((post, idx) => (
              <Link
                href={`/blog/${post.slug.current}`}
                key={post._id}
                className={`group flex flex-col bg-white backdrop-blur-sm rounded-[3rem] overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.mainImage ? urlFor(post.mainImage).width(800).url() : "https://dummyimage.com/800x500/020617/334155"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#C1121F] text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      {post.categories?.[0] || 'Blog'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-10">
                  <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <span className="text-[#C1121F]">{formatDate(post.publishedAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{post.readingTime || '5 min'} READ</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 leading-[1.2] group-hover:text-[#C1121F] transition-colors duration-300 mb-5 line-clamp-2 uppercase tracking-tight">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-10 line-clamp-3 font-medium">
                    {truncateText(post.excerpt || "Explore the latest updates and insights from Nepatronix.", 25)}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-900 shadow-inner font-mono">
                        {post.author?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-[#C1121F] uppercase tracking-widest leading-none">Curated by</span>
                        <span className="text-xs font-bold text-gray-900 tracking-tight">{post.author}</span>
                      </div>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:bg-[#C1121F] group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center animate-in fade-in duration-700">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-8 border border-gray-200 shadow-inner">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No matches for "{searchQuery}"</h3>
              <p className="text-gray-600 font-medium max-w-sm mx-auto">We couldn't find any articles matching your search. Try different keywords or browse our categories.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-8 text-[#C1121F] font-bold uppercase tracking-widest text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {filteredPosts.length > displayCount && (
          <div className="py-24 flex justify-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="px-12 py-5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-[#C1121F] hover:text-white hover:border-transparent transition-all active:scale-95 flex items-center gap-3 group"
            >
              <span>Show More Stories</span>
              <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
