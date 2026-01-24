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
  images: Array<{
    asset: {
      _ref: string;
      _type: string;
    };
    caption?: string;
    alt?: string;
  }>;
}

interface FlattenedGalleryItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<FlattenedGalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<FlattenedGalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const query = `*[_type == "gallery"] | order(publishedAt desc) {
        _id,
        title,
        description,
        images
      }`;
      const data = await client.fetch<GalleryItem[]>(query);
      
      // Flatten the images so each image in the array becomes its own card
      const flattened: FlattenedGalleryItem[] = data.flatMap((doc) => 
        (doc.images || []).map((img, index) => ({
          id: `${doc._id}-${index}`,
          title: img.caption || doc.title, // Use image caption if available, else group title
          description: doc.description,
          image: img
        }))
      );

      setItems(flattened);
    };

    fetchGallery();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC]">
      
      {/* Header Section */}
      <div className="relative bg-[#020617] px-6 pt-44 pb-16 text-center overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Our Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed mb-10">
            A visual showcase of our journey, student innovations, and community events.
          </p>
          
          <div className="flex w-full max-w-lg mx-auto items-center gap-2">
            <div className="relative flex-1 group">
              <input 
                type="text" 
                placeholder="Search moments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 pl-12 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
              />
              <svg className="absolute left-4 top-3 h-5 w-5 text-gray-500 group-focus-within:text-[#C1121F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedImage(item)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 cursor-pointer border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            {/* Main Image */}
            <Image
              src={urlFor(item.image).width(600).url()}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Hover Overlay with Description */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
               <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-sm font-bold text-white mb-1 leading-tight line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-[10px] line-clamp-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center text-white/40 text-[9px] font-bold uppercase tracking-widest gap-2">
                     <span>View Details</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Big Picture Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 lg:p-10 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 z-[110] text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative w-full max-w-6xl h-full flex flex-col lg:flex-row bg-black/50 rounded-3xl overflow-hidden overflow-y-auto lg:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Big Image Section */}
            <div className="relative flex-1 min-h-[50vh] lg:min-h-full">
               <Image
                src={urlFor(selectedImage.image).url()}
                alt={selectedImage.title}
                fill
                className="object-contain"
                priority
               />
            </div>

            {/* Side Description (Desktop) or Bottom Description (Mobile) */}
            <div className="w-full lg:w-80 bg-black/80 lg:bg-black/40 backdrop-blur-sm p-8 lg:p-10 flex flex-col justify-center text-left">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4 leading-tight">
                  {selectedImage.title}
                </h2>
                <div className="h-1 w-8 bg-[#C1121F] mb-6"></div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {selectedImage.description}
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-[#C1121F] hover:text-white transition-all"
                  >
                    Close Preview
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
         <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-medium">No moments found matching your search.</p>
             <button onClick={() => setSearchQuery("")} className="mt-4 text-[#C1121F] text-sm font-semibold hover:underline">Clear search</button>
         </div>
      )}

      <div className="mt-24 text-center">
         <p className="text-slate-500 mb-6 font-medium">Want to see more?</p>
         <a 
           href="https://www.facebook.com/NepaTronixx" 
           target="_blank" 
           rel="noopener noreferrer"
           className="inline-block px-10 py-4 bg-[#020617] text-white font-bold rounded-full hover:bg-[#C1121F] transition-all active:scale-95 shadow-xl"
         >
           Follow us on Facebook
         </a>
      </div>

    </div>
    </div>
  );
}
