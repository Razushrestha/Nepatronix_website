"use client";

import { useState } from "react";
import Image from "next/image";

const recognitionData = [
  { name: "ICT Startup Award", logo: "/recognition/ICT.png" },
  { name: "IIT Madras", logo: "/recognition/iit_madras-removebg-preview.png" },
  { name: "IITM Pravartak", logo: "/recognition/IITM_pravatak-removebg-preview.png" },
  { name: "Government of Nepal", logo: "/recognition/NepalGov.png" },
  { name: "Kathmandu University", logo: "/recognition/KU.png" },
  { name: "Indian Embassy", logo: "/recognition/embassy_of_india-removebg-preview.png" },
  { name: "INSPAN Program", logo: "/recognition/INSPAN.png" },
  { name: "EU Business Forum", logo: "/recognition/EUbusinessforum.png" },
];

export function RecognitionGrid() {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;

  return (
    <div className="flex flex-col items-center">
      <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 w-full">
        {recognitionData.map((org, index) => {
          const isHiddenOnMobile = index >= initialCount && !showAll;
          
          return (
            <div
              key={org.name}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border border-transparent hover:border-[#C1121F]/10 hover:shadow-lg hover:shadow-red-900/5 transition-all duration-300 ${isHiddenOnMobile ? 'hidden md:flex' : 'flex'}`}
            >
              <div className="flex h-24 w-full items-center justify-center">
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={120}
                  height={120}
                  className={`h-auto w-auto max-w-full object-contain ${
                    org.name === "Indian Embassy" ? "max-h-24" : "max-h-20"
                  }`}
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-slate-600">
                {org.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* See More Button - Only if there are more items to show */}
      {!showAll && recognitionData.length > initialCount && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-8 rounded-full bg-[#C1121F] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#A30F19] transition-all md:hidden"
        >
          See More
        </button>
      )}
      
      {/* Show Less Button (optional, but good UX) */}
      {showAll && recognitionData.length > initialCount && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-8 rounded-full border border-[#C1121F] text-[#C1121F] px-6 py-2 text-sm font-semibold hover:bg-[#C1121F]/5 transition-all md:hidden"
        >
          Show Less
        </button>
      )}
    </div>
  );
}
