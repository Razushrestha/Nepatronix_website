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
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* Header Section */}
      <div className="relative bg-[#020617] px-6 pt-44 pb-16 text-center overflow-hidden">
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
            className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={urlFor(item.image).width(600).height(600).url()}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-bold line-clamp-1">{item.title}</p>
                <p className="text-gray-300 text-xs mt-1 line-clamp-2">{item.description}</p>
              </div>
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

      {/* Lightbox / Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-5xl w-full grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={urlFor(selectedImage.image).width(1200).url()}
                alt={selectedImage.title}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <div className="text-left space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">{selectedImage.title}</h2>
                  <div className="h-1 w-12 bg-[#C1121F]"></div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
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
