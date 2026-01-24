'use client'

import React, { useState, useEffect } from 'react'
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

interface FlipCardProps {
  index: number
  rowIndex: number
}

const DynamicFlipCard: React.FC<FlipCardProps> = ({ index, rowIndex }) => {
  const [currentSchool, setCurrentSchool] = useState<School>(schools[index % schools.length])
  const [backSchool, setBackSchool] = useState<School>(schools[(index + 6) % schools.length])
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // Create a random selection of schools excluding current ones
      const availableSchools = schools.filter(school => 
        school.name !== currentSchool.name && school.name !== backSchool.name
      )
      
      // Randomly decide which side to change (front or back)
      const changeBack = Math.random() > 0.5
      
      // First, trigger the flip animation
      setIsFlipped(prev => !prev)
      
      // Then, after a short delay, change the logos during the flip
      setTimeout(() => {
        if (changeBack && availableSchools.length > 0) {
          const randomSchool = availableSchools[Math.floor(Math.random() * availableSchools.length)]
          setBackSchool(randomSchool)
        } else if (availableSchools.length > 0) {
          const randomSchool = availableSchools[Math.floor(Math.random() * availableSchools.length)]
          setCurrentSchool(randomSchool)
        }
      }, 2500) // Change logos halfway through the 5s flip transition
      
    }, 3000 + Math.random() * 2000) // Random interval between 3-5 seconds

    return () => clearInterval(interval)
  }, [currentSchool, backSchool, index])

  return (
    <div
      className={`flip-card-random h-28 w-full ${isFlipped ? 'flipped' : ''}`}
      style={{ 
        animationDelay: `${(index + rowIndex * 6) * 0.2}s`,
      }}
    >
      <div className="flip-card-inner relative h-full w-full">
        <div className="flip-card-front absolute inset-0 flex items-center justify-center rounded-xl border border-[#e3f2fd] bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="text-center">
            <div className="mb-3 flex h-16 items-center justify-center">
              <Image
                src={currentSchool.logo}
                alt={currentSchool.name}
                width={100}
                height={64}
                className="h-auto max-h-12 w-auto max-w-full object-contain"
              />
            </div>
            <p className="text-sm font-semibold text-[#1f2933]">{currentSchool.name}</p>
          </div>
        </div>
        <div className="flip-card-back absolute inset-0 flex items-center justify-center rounded-xl border border-[#1e88e5] bg-gradient-to-br from-[#1e88e5]/15 to-[#1e88e5]/5 p-4 shadow-lg">
          <div className="text-center">
            <div className="mb-3 flex h-16 items-center justify-center">
              <Image
                src={backSchool.logo}
                alt={backSchool.name}
                width={100}
                height={64}
                className="h-auto max-h-12 w-auto max-w-full object-contain"
              />
            </div>
            <p className="text-sm font-bold text-[#1e88e5]">{backSchool.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SchoolCollaborations() {
  const [isExpanded, setIsExpanded] = useState(false);

  // We flatten the list for easier slicing
  const totalSchools = 12; // 2 rows of 6
  // On mobile, show 6. On larger screens, we might want to show all continuously or keep the 2-row layout?
  // The user specifically asked for "mobile phone mode... show 6... then see more".
  // The original layout was 2 explicit rows.
  // I will adapt the layout to be a single grid that wraps.
  
  return (
    <div className="mt-16 bg-slate-50 rounded-3xl p-6 sm:p-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: totalSchools }, (_, i) => {
           // If on mobile (hidden by default unless expanded or within first 6)
           // We can use a class to hide elements > 6 if not expanded?
           // Easier to map all and use CSS classes for conditional display based on breakpoint
           const isHiddenOnMobile = i >= 6 && !isExpanded;
           
           return (
             <div 
               key={`school-${i}`} 
               className={`${isHiddenOnMobile ? 'hidden md:block' : 'block'}`}
             >
               <DynamicFlipCard index={i} rowIndex={Math.floor(i / 6)} />
             </div>
           );
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