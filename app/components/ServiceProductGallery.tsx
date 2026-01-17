"use client";

import { useState } from "react";
import Image from "next/image";

export default function ServiceProductGallery() {
  const [showAll, setShowAll] = useState(false);
  
  const productImages = [
    "https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=800", // Robotics
    "https://images.unsplash.com/photo-1629815142333-e1cb53805c89?q=80&w=800", // Circuit
    "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800", // Electronics
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800", // Breadboard/Chip
    "https://images.unsplash.com/photo-1563770095-39d468f9a51d?q=80&w=800", // Futuristic tech
    "https://images.unsplash.com/photo-1531053326607-9d349096d887?q=80&w=800", // AI/Brain
    "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=800", // Lab
    "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=800", // Light/Sensor
  ];

  const products = [1, 2, 3, 4, 5, 6, 7, 8];
  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="px-8 sm:px-12 py-16 bg-[#F8FAFF] border-t border-[#E6EBF2]">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B3C74] mb-4">
          Our Products & Kits
        </h2>
        <div className="h-1 w-16 bg-[#C4161C] rounded-full mx-auto"></div>
        <p className="mt-4 text-[#5F6C7B] max-w-2xl mx-auto">
          Explore our range of locally engineered STEM kits and research
          prototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
        {displayedProducts.map((item, idx) => (
          <div
            key={item}
            className="group relative rounded-2xl overflow-hidden shadow-md aspect-square hover:shadow-xl transition-all duration-300 bg-white border border-[#E6EBF2] hover:border-[#0B3C74]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C74]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-6">
              <span className="text-white font-bold text-lg">
                STEM Kit Model X-{item}
              </span>
              <span className="text-blue-100 text-sm font-medium">
                Educational Robotics
              </span>
            </div>
            <Image
              src={productImages[idx % productImages.length]}
              alt={`Product ${item}`}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      {!showAll && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white border-2 border-[#E6EBF2] rounded-full text-[#0B3C74] font-bold text-sm hover:bg-[#0B3C74] hover:border-[#0B3C74] hover:text-white transition-all shadow-sm hover:shadow-lg"
          >
            See More Products
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
