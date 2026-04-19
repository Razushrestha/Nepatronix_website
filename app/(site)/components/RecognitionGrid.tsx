"use client";

import { useState } from "react";
import Image from "next/image";

const recognitionData = [
  { name: "ICT Startup Award", logo: "/recognition/ICT.png" },
  { name: "Government of Nepal", logo: "/recognition/NepalGov.png" },
  { name: "Kathmandu University", logo: "/recognition/KU.png" },
  { name: "Indian Embassy", logo: "/recognition/embassy_of_india-removebg-preview.png" },
  { name: "IIT Madras Pravartak", logo: "/pravartak.png" },
  { name: "INSPAN Program", logo: "/recognition/INSPAN.png" },
  { name: "EU Business Forum", logo: "/recognition/EUbusinessforum.png" },
];

export function RecognitionGrid() {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;

  return (
    <div className="flex flex-col items-center">
      <div className="mt-16 flex w-full flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-10 sm:gap-y-12">
        {recognitionData.map((org, index) => {
          const isHiddenOnMobile = index >= initialCount && !showAll;
          const wideLogo = org.name === "Indian Embassy" || org.name === "IIT Madras Pravartak";

          return (
            <div
              key={org.name}
              className={`flex w-[42%] max-w-[11.5rem] flex-col items-center justify-center p-3 sm:w-[28%] sm:max-w-[12rem] md:w-[22%] md:max-w-[13rem] lg:w-[22%] lg:max-w-[14rem] rounded-xl border border-transparent transition-all duration-300 hover:border-[#C1121F]/10 hover:shadow-lg hover:shadow-red-900/5 ${isHiddenOnMobile ? "hidden md:flex" : "flex"}`}
            >
              <div className="flex h-24 w-full items-center justify-center">
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={wideLogo ? 220 : 120}
                  height={wideLogo ? 110 : 120}
                  className="h-auto w-auto max-w-full object-contain max-h-20"
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
