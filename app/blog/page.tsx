"use client";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import Image from "next/image";

// Define the type for a blog post based on your Sanity schema
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
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const query = `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        excerpt,
        publishedAt,
        readingTime,
        "categories": categories[],
        mainImage,
        author
      }`;
      const posts = await client.fetch<BlogPost[]>(query);
      setBlogPosts(posts);
      if (posts.length > 0) {
        setFeaturedPost(posts[0]);
      }
    };

    fetchPosts();
  }, []);

  // Filter logic
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.categories?.includes(activeCategory);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    ...new Set(blogPosts.flatMap((post) => post.categories).filter(Boolean)),
  ];

  if (!featuredPost) {
    return <div>Loading...</div>;
  }


  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* Header Section */}
      <div className="relative bg-[#020617] px-6 py-20 lg:py-24 text-center overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-[#C1121F]/10 px-4 py-1.5 text-sm font-bold text-[#C1121F] ring-1 ring-[#C1121F]/20 mb-6 shadow-sm">
            Blog
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Discover our latest news
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Discover the achievements that set us apart. From groundbreaking projects to industry accolades, we take pride in our accomplishments.
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
            <button className="rounded-xl bg-[#C1121F] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#A30F19] transition-all active:scale-95">
              Find Now
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {/* Insights & Updates Sub-header */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 border-l-4 border-[#C1121F] pl-6">
          <h2 className="text-sm font-bold text-[#C1121F] uppercase tracking-wider mb-2">Insights & Updates</h2>
          <h1 className="text-3xl font-extrabold text-[#020617] tracking-tight sm:text-4xl">
            The Latest <span className="text-[#C1121F]">Stories</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Deep dives into product strategy, design systems, and the future of digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 mb-20">
          {/* Left: Featured Post */}
          <div className="lg:col-span-2 group cursor-pointer relative">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-xl shadow-slate-200">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent z-10 opacity-80 transition-opacity duration-500 group-hover:opacity-70" />
              <Image
                src={urlFor(featuredPost.mainImage).url()}
                alt={featuredPost.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                 <span className="inline-block rounded-full bg-[#C1121F] px-4 py-1.5 text-xs font-bold text-white mb-4 shadow-md">
                   {featuredPost.categories?.[0]}
                 </span>
                 <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight group-hover:text-gray-100 transition-colors mb-4">
                   {featuredPost.title}
                 </h2>
                 <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                    <span className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                            {featuredPost.author?.charAt(0)}
                        </div>
                        {featuredPost.author}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F]" />
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right: Editor's Picks */}
          <div className="lg:col-span-1 flex flex-col justify-between space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-[#020617] flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-[#C1121F] rounded-full"></span>
                      Editor's Picks
                  </h3>
                  <span className="text-xs font-bold text-[#C1121F] hover:underline cursor-pointer">View All</span>
                </div>
                
                <div className="flex flex-col gap-6">
                {blogPosts.slice(1, 4).map((post) => (
                    <div key={post._id} className="group flex gap-4 items-start cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors -mx-2">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                          <Image src={urlFor(post.mainImage).width(200).url()} alt={post.title} fill className="object-cover transition group-hover:scale-110" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#C1121F] uppercase tracking-wider block mb-1">{post.categories?.[0]}</span>
                          <h4 className="text-sm font-bold text-[#020617] leading-snug group-hover:text-[#C1121F] transition-colors line-clamp-2">
                              {post.title}
                          </h4>
                          <span className="text-xs text-slate-400 mt-2 block">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="px-6 py-8 bg-[#020617] rounded-3xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                   <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM4 6H20L12 11L4 6Z"/></svg>
               </div>
               <h4 className="font-bold text-lg mb-2 relative z-10">Subscribe to our newsletter</h4>
               <p className="text-sm text-gray-400 mb-6 relative z-10">Get the latest insights delivered weekly.</p>
               <div className="flex gap-2 relative z-10">
                  <input type="email" placeholder="Email address" className="w-full text-sm px-4 py-3 rounded-xl bg-white/10 border-0 focus:ring-2 focus:ring-[#C1121F] text-white placeholder-gray-500" />
                  <button className="bg-[#C1121F] text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-[#A30F19] transition-colors shadow-lg">Join</button>
               </div>
            </div>
          </div>
        </div>

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

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post._id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100">
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-[#020617] shadow-sm">
                  {post.readingTime}
                </div>
                <Image
                  src={post.mainImage ? urlFor(post.mainImage).width(600).url() : "https://dummyimage.com/600x400/ccc/fff"}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="flex flex-col flex-1 p-8">
                 <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-[10px] font-bold text-[#C1121F] uppercase tracking-wide">
                        {post.categories?.[0] || 'Blog'}
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-[#020617] leading-tight group-hover:text-[#C1121F] transition mb-3">
                   {post.title}
                 </h3>
                 <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                   {post.excerpt}
                 </p>
                 
                 <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-[#020617] font-bold">
                          {post.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{post.author}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{new Date(post.publishedAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </article>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
           <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-500 font-medium">No stories found matching your criteria.</p>
               <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-[#C1121F] text-sm font-bold hover:underline">Clear filters</button>
           </div>
        )}

        <div className="py-16 flex justify-center">
           {filteredPosts.length > 0 && (
               <button className="px-10 py-4 rounded-full bg-[#020617] text-white font-bold shadow-lg hover:bg-[#C1121F] transition-all active:scale-95">
                 Load More Stories
               </button>
           )}
        </div>
      </div>
    </div>
  );
}
