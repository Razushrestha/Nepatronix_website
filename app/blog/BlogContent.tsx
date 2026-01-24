"use client";

import { urlFor } from "@/sanity/lib/image";
import { useState, useRef, useMemo } from "react";
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(9);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categories = useMemo(() => [
    "All",
    ...Array.from(new Set(initialPosts.flatMap((post) => post.categories).filter(Boolean))),
  ], [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.categories?.includes(activeCategory);
      
      if (!searchQuery.trim()) return matchesCategory;

      const query = searchQuery.toLowerCase().trim();
      const searchTerms = query.split(/\s+/);
      
      const searchableText = [
        post.title,
        post.excerpt,
        post.author,
        ...(post.categories || [])
      ].join(" ").toLowerCase();

      const matchesSearch = searchTerms.every(term => searchableText.includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, activeCategory, searchQuery]);

  const featuredPost = initialPosts[0];
  const isSearchActive = searchQuery.trim().length > 0;

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
    <>
      {/* Header Section */}
      <div className="relative bg-[#020617] px-6 pt-44 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-[#C1121F]/10 px-4 py-1.5 text-sm font-bold text-[#C1121F] ring-1 ring-[#C1121F]/20 mb-6 shadow-sm">
            Blog
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Discover our latest news
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Explore insights, achievements, and the latest technological trends from our experts.
          </p>
          
          <div className="mt-10 flex w-full max-w-lg mx-auto items-center gap-2">
            <div className="relative flex-1 group">
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-5 py-4 pl-12 text-sm text-white placeholder-gray-400 shadow-2xl backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
              />
              <svg className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#C1121F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={scrollToResults}
              className="rounded-xl bg-[#C1121F] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#A30F19] transition-all active:scale-95"
            >
              Find Now
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16" ref={resultsRef}>
        {!isSearchActive ? (
          <>
            <div className="mb-12 border-l-4 border-[#C1121F] pl-6">
              <h2 className="text-sm font-bold text-[#C1121F] uppercase tracking-wider mb-2">Insights & Updates</h2>
              <h1 className="text-3xl font-extrabold text-[#020617] tracking-tight sm:text-4xl">
                The Latest <span className="text-[#C1121F]">Stories</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 mb-20">
              <Link href={`/blog/${featuredPost.slug.current}`} className="lg:col-span-2 group cursor-pointer relative block bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 border border-slate-100 transition-all hover:shadow-red-900/5 hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={urlFor(featuredPost.mainImage).width(1200).url()}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="p-8 sm:p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-5">
                       <span className="inline-block rounded-full bg-[#C1121F]/10 px-4 py-1.5 text-xs font-extrabold text-[#C1121F] uppercase tracking-wider">
                         {featuredPost.categories?.[0] || 'Featured'}
                       </span>
                       <span className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(featuredPost.publishedAt)}
                       </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#020617] leading-[1.2] group-hover:text-[#C1121F] transition-colors mb-6">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-2 italic">
                      {featuredPost.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#020617] to-slate-800 flex items-center justify-center text-sm font-bold text-white shadow-md">
                             {featuredPost.author?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#020617] leading-none mb-1">{featuredPost.author}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Editor in Chief</p>
                          </div>
                       </div>
                       <span className="text-[#C1121F] font-bold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                         Read Article
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                         </svg>
                       </span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="lg:col-span-1 flex flex-col space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-1">
                    <h3 className="text-xl font-bold text-[#020617] flex items-center gap-3 mb-8">
                        <span className="w-1.5 h-6 bg-[#C1121F] rounded-full"></span>
                        Recent Posts
                    </h3>
                    <div className="flex flex-col gap-6">
                    {initialPosts.slice(1, 4).map((post) => (
                        <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex gap-4 items-start cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors -mx-2">
                          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden shadow-sm">
                            <Image src={urlFor(post.mainImage).width(200).url()} alt={post.title} fill className="object-cover transition group-hover:scale-110" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-[#C1121F] uppercase tracking-wider block mb-1">
                              {post.categories?.[0] || 'Update'} • {formatDate(post.publishedAt)}
                            </span>
                            <h4 className="text-sm font-bold text-[#020617] leading-snug group-hover:text-[#C1121F] transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                          </div>
                        </Link>
                    ))}
                    </div>
                </div>
                
                <div className="px-6 py-8 bg-[#020617] rounded-3xl text-white relative overflow-hidden">
                  <h4 className="font-bold text-lg mb-2 relative z-10">Subscribe</h4>
                  <p className="text-sm text-gray-400 mb-6 relative z-10">Get the latest insights delivered weekly.</p>
                  <div className="flex gap-2 relative z-10">
                      <input type="email" placeholder="Email" className="w-full text-sm px-4 py-3 rounded-xl bg-white/10 border-0 text-white placeholder-gray-500" />
                      <button className="bg-[#C1121F] text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-[#A30F19] transition-colors shadow-lg">Join</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-12">
            <h2 className="text-sm font-bold text-[#C1121F] uppercase tracking-wider mb-2">Search Results</h2>
            <h1 className="text-3xl font-extrabold text-[#020617] tracking-tight sm:text-4xl">
              Found <span className="text-[#C1121F]">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
            </h1>
          </div>
        )}

        {/* Filter Bar */}
        <div className="sticky top-4 z-30 mb-12 bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-sm border border-slate-200/60 inline-flex max-w-full overflow-x-auto mx-auto left-0 right-0 justify-center">
             <div className="flex items-center gap-1">
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                       activeCategory === cat 
                         ? "bg-[#C1121F] text-white shadow-lg shadow-red-900/20" 
                         : "text-slate-600 hover:bg-slate-100"
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(0, displayCount).map((post) => (
            <Link href={`/blog/${post.slug.current}`} key={post._id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <Image
                  src={post.mainImage ? urlFor(post.mainImage).width(600).url() : "https://dummyimage.com/600x400/ccc/fff"}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col flex-1 p-8">
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-[10px] font-bold text-[#C1121F] uppercase tracking-wide">
                        {post.categories?.[0] || 'Blog'}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-[#020617] leading-tight group-hover:text-[#C1121F] transition mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                 {truncateText(post.excerpt || "Explore the latest updates and insights from Nepatronix.", 30)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-700">{post.author}</span>
                    <span className="text-xs text-slate-400 font-medium">{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
           <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-500 font-medium">No stories found matching your criteria.</p>
               <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-[#C1121F] text-sm font-bold hover:underline">Clear filters</button>
           </div>
        )}

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
    </>
  );
}
