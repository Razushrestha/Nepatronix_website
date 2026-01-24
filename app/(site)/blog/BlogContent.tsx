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
    <div className="bg-white">
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

      {/* Modern Hero Section */}
      <div className="relative bg-[#020617] pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#C1121F]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid-pattern.svg')]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="h-[2px] w-12 bg-[#C1121F]"></span>
              <span className="text-[#C1121F] font-bold uppercase tracking-widest text-sm">Our Journal</span>
              <span className="h-[2px] w-12 bg-[#C1121F]"></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Exploring the <span className="text-[#C1121F]">Future</span> of Technology.
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Insights from the heart of Nepal's tech scene. From robotics breakthroughs to educational strategies, discover what moves us.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-12 relative z-20 pb-24">
        <div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 mb-24">
            {/* Featured Bento Card */}
            <Link href={`/blog/${featuredPost.slug.current}`} className="lg:col-span-8 group relative block h-[400px] md:h-[480px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1">
              <Image
                src={urlFor(featuredPost.mainImage).width(1200).url()}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                priority
              />
              
              {/* High-end Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="max-w-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 bg-[#C1121F] text-white px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-red-900/20">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      Featured
                    </span>
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight group-hover:text-red-400 transition-colors duration-500">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-slate-300 text-sm md:text-base line-clamp-2 font-medium leading-relaxed opacity-90">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C1121F] to-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
                      {featuredPost.author?.charAt(0)}
                    </div>
                    <span className="text-white/80 font-bold text-xs tracking-wide">{featuredPost.author}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sidebar Recent Grid */}
            <div className="lg:col-span-4 h-full flex flex-col">
              <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col md:h-[480px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <h3 className="text-xl font-bold text-[#020617] tracking-tight">
                    Recent Stories
                  </h3>
                  <div className="h-1 w-8 bg-[#C1121F] rounded-full" />
                </div>
                
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  {initialPosts.slice(1, 5).map((post) => (
                    <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md transition-all duration-500">
                        <Image src={urlFor(post.mainImage).width(200).url()} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-[#C1121F] font-bold uppercase tracking-[0.2em]">
                          {post.categories?.[0] || 'Update'}
                        </span>
                        <h4 className="text-sm font-bold text-[#020617] group-hover:text-[#C1121F] transition-colors line-clamp-2 leading-tight tracking-tight">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <button onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })} className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs hover:bg-[#C1121F] hover:text-white transition-all duration-300 group/btn">
                    Explore More
                    <svg className="w-3.5 h-3.5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Search Bar */}
        <div className="mb-20 max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-[#C1121F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by keywords, categories, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 py-5 pl-16 pr-8 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C1121F] focus:ring-4 focus:ring-red-500/5 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-lg font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-[#C1121F] transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-widest mr-2">Clear</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Robotics', 'AI', 'Innovation', 'Education'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 hover:bg-[#C1121F] hover:text-white transition-all border border-slate-100"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-[#020617] tracking-tight">
            {searchQuery ? (
              <>Search results for <span className="text-[#C1121F]">"{searchQuery}"</span></>
            ) : (
              <>Latest <span className="text-[#C1121F]">Articles</span></>
            )}
          </h2>
          <div className="h-px flex-1 bg-slate-100 mx-8"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {searchQuery ? `${filteredPosts.length} Found` : 'Archive'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.length > 0 ? (
            filteredPosts.slice(0, displayCount).map((post, idx) => (
              <Link
                href={`/blog/${post.slug.current}`}
                key={post._id}
                className={`group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.mainImage ? urlFor(post.mainImage).width(800).url() : "https://dummyimage.com/800x500/f1f5f9/94a3b8"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 backdrop-blur-md text-[#020617] px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl border border-white/20">
                      {post.categories?.[0] || 'Blog'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-10">
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                    <span className="text-[#C1121F]">{formatDate(post.publishedAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{post.readingTime || '5 min'} READ</span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#020617] leading-[1.2] group-hover:text-[#C1121F] transition-colors duration-300 mb-5 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-3 font-medium opacity-80">
                    {truncateText(post.excerpt || "Explore the latest updates and insights from Nepatronix.", 25)}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-[#020617] shadow-inner font-mono">
                        {post.author?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-[#C1121F] uppercase tracking-widest leading-none">Curated by</span>
                        <span className="text-xs font-bold text-slate-900 tracking-tight">{post.author}</span>
                      </div>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#C1121F] group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
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
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 mb-8 border border-slate-100 shadow-inner">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#020617] mb-3">No matches for "{searchQuery}"</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">We couldn't find any articles matching your search. Try different keywords or browse our categories.</p>
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
          <div className="py-16 flex justify-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="px-10 py-4 rounded-full bg-[#020617] text-white font-bold shadow-lg hover:bg-[#C1121F] transition-all active:scale-95"
            >
              Show More Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
