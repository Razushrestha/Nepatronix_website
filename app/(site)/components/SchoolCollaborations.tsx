'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface School {
  name: string
  logo: string
}

const schools: School[] = [
  { name: "BIT", logo: "/school_College/BIT-removebg-preview.png" },
  { name: "Bramarupa", logo: "/school_College/bramarupa-removebg-preview.png" },
  { name: "Candid Career", logo: "/school_College/candidcareer-removebg-preview.png" },
  { name: "Himchuli", logo: "/school_College/himchuli-removebg-preview.png" },
  { name: "Marvellous", logo: "/school_College/marvellous-removebg-preview.png" },
  { name: "Mrigashira", logo: "/school_College/mrigashira-removebg-preview.png" },
  { name: "National Infotech", logo: "/school_College/nationalinfotech-removebg-preview.png" },
  { name: "NCCS", logo: "/school_College/nccs-removebg-preview.png" },
  { name: "Prime College", logo: "/school_College/primecollege-removebg-preview.png" },
  { name: "Rainbow", logo: "/school_College/rainbow-removebg-preview.png" },
  { name: "Siddhartha Vidyapeeth", logo: "/school_College/siddhartha_vidyapeeth-removebg-preview.png" },
  { name: "Texas College", logo: "/school_College/texas_college.png" },
]

function SchoolCard({ school }: { school: School }) {
  return (
    <div className="flex h-28 w-full flex-col items-center justify-center rounded-xl border border-[#e3f2fd] bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="mb-2 flex h-16 shrink-0 items-center justify-center">
        <Image
          src={school.logo}
          alt={school.name}
          width={100}
          height={64}
          className="h-auto max-h-12 w-auto max-w-full object-contain"
        />
      </div>
      <p className="line-clamp-2 text-center text-xs font-semibold text-[#1f2933] sm:text-sm">
        {school.name}
      </p>
    </div>
  )
}

export default function SchoolCollaborations() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-16 bg-slate-50 rounded-3xl p-6 sm:p-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {schools.map((school, i) => {
          const isHiddenOnMobile = i >= 6 && !isExpanded

          return (
            <div
              key={school.name}
              className={isHiddenOnMobile ? 'hidden md:block' : 'block'}
            >
              <SchoolCard school={school} />
            </div>
          )
        })}
      </div>
      
      {/* Mobile-only See More Button */}
      {!isExpanded && (
        <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#C1121F] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#A30F19] transition-all active:scale-95"
            >
              See All Partners
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
        </div>
      )}
      
       {/* Mobile-only See Less Button */}
      {isExpanded && (
        <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[#C1121F] bg-white px-6 py-2.5 text-sm font-semibold text-[#C1121F] hover:bg-[#C1121F]/5 transition-all active:scale-95"
            >
              Show Less
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
        </div>
      )}
    </div>
  )
}