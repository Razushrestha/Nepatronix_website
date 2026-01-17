"use client";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import Image from "next/image";

// Define the type for a gallery item based on your Sanity schema
interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  category: string;
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const query = `*[_type == "gallery"] | order(publishedAt desc) {
        _id,
        title,
        description,
        image,
        category
      }`;
      const data = await client.fetch<GalleryItem[]>(query);
      setItems(data);
    };

    fetchGallery();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC]">
      
      {/* Header Section */}
      <div className="relative bg-[#020617] px-6 py-20 lg:py-24 text-center overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-[#C1121F]/10 px-4 py-1.5 text-sm font-bold text-[#C1121F] ring-1 ring-[#C1121F]/20 mb-6 shadow-sm">
            Gallery
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Discover our latest moments
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Explore the visual journey of our team, events, and culture. From behind-the-scenes to big celebrations, see what makes us tick.
          </p>
          
          <div className="mt-10 flex w-full max-w-lg mx-auto items-center gap-2">
            <div className="relative flex-1 group">
              <input 
                type="text" 
                placeholder="Search gallery..." 
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
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item._id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100">
            {/* Image Container */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center">
                  <span className="px-4 py-2 bg-[#C1121F] text-white text-xs font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Full Size
                  </span>
               </div>
               <Image
                src={urlFor(item.image).width(600).url()}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-[#020617] shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#020617] mb-2 group-hover:text-[#C1121F] transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
         <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-medium">No moments found matching your search.</p>
             <button onClick={() => setSearchQuery("")} className="mt-4 text-[#C1121F] text-sm font-semibold hover:underline">Clear search</button>
         </div>
      )}

      <div className="mt-24 text-center">
         <p className="text-slate-500 mb-6 font-medium">Want to see more?</p>
         <button className="px-10 py-4 bg-[#020617] text-white font-bold rounded-full hover:bg-[#C1121F] transition-all active:scale-95 shadow-xl">
           Follow us on Instagram
         </button>
      </div>

    </div>
    </div>
  );
}
