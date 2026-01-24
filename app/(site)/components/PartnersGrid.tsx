"use client";

import { useState } from "react";
import Image from "next/image";

const partnersData = [
  { name: "Gyan Bazzar", logo: "/partner/gyanbazzar.png" },
  { name: "Drone Hub", logo: "/partner/dronehub.png" },
  { name: "diyo.ai", logo: "/partner/diyo.ai.png" },
  { name: "Edtra", logo: "/partner/edtra.png" },
  { name: "Himalayan Solution", logo: "/partner/himalayansolution.png" },
  { name: "Thokbikreta", logo: "/partner/Thokbikrita.png" },
  { name: "Yarsa Tech", logo: "/partner/Yarsatech.png" },
  { name: "Tridev Innovations", logo: "/partner/Tridev.png" },
  { name: "Esewa", logo: "/partner/Esewa.png" },
  { name: "Laxmi Sunrise Bank", logo: "/partner/laxmisunrise.png" },
  { name: "Siddhartha Bank", logo: "/partner/Siddhartha bank.png" },
  { name: "Youth Innovation Lab", logo: "/partner/Youth_Innovation_Lab_textlogo.svg_.png" },
];

export function PartnersGrid() {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;

  return (
    <div className="flex flex-col items-center">
      <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full">
        {partnersData.map((partner, index) => {
          const isHiddenOnMobile = index >= initialCount && !showAll;
          
          return (
            <div
              key={partner.name}
              className={`flex flex-col items-center justify-center transition-all duration-300 hover:opacity-80 rounded-xl p-4 hover:bg-slate-50 ${isHiddenOnMobile ? 'hidden md:flex' : 'flex'}`}
            >
              <div className="flex h-24 w-full items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="h-auto max-h-20 w-auto max-w-full object-contain"
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-[#64748b]">
                {partner.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile-only See More Button */}
      {!showAll && partnersData.length > initialCount && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-8 rounded-full bg-[#C1121F] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#A30F19] transition-all active:scale-95 md:hidden"
        >
          See More
        </button>
      )}

      {/* Mobile-only See Less Button */}
      {showAll && partnersData.length > initialCount && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-8 rounded-full border border-[#C1121F] bg-white px-6 py-2.5 text-sm font-semibold text-[#C1121F] hover:bg-[#C1121F]/5 transition-all active:scale-95 md:hidden"
        >
          Show Less
        </button>
      )}
    </div>
  );
}
