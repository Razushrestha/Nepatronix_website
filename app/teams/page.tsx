"use client";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import Image from "next/image";

// Define the type for a team member based on your Sanity schema
interface TeamMember {
  _id: string;
  name: string;
  title: string;
  role: "Leadership" | "Advisor" | "Team";
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}

// Helper component for rendering team member cards
const TeamMemberCard = ({ member, className = "" }: { member: TeamMember; className?: string }) => (
  <div className={`group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/10 hover:-translate-y-2 ${className}`}>
    {/* Profile Image */}
    <div className="relative mb-6">
      <div className="aspect-square relative overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={member.image ? urlFor(member.image).width(400).url() : "https://dummyimage.com/400x400/ccc/fff"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        {/* Social Overlay */}
        <div className="absolute inset-0 bg-[#C1121F]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white text-[#C1121F] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
             </div>
             <div className="w-10 h-10 rounded-full bg-white text-[#C1121F] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
             </div>
        </div>
      </div>
    </div>

    {/* Member Info */}
    <div className="text-center space-y-2">
      <h3 className="text-xl font-bold text-[#020617] group-hover:text-[#C1121F] transition-colors">{member.name}</h3>
      <p className="text-slate-500 text-sm font-medium">{member.title}</p>
    </div>

    {/* Decorative Bottom Bar */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C1121F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);

export default function TeamPage() {
  const [teamMembersData, setTeamMembersData] = useState<TeamMember[]>([]);
  const [isSquadExpanded, setIsSquadExpanded] = useState(false);
  const initialSquadCount = 4;

  useEffect(() => {
    const fetchTeam = async () => {
      const query = `*[_type == "teamMember"] | order(order asc) {
        _id,
        name,
        title,
        role,
        image
      }`;
      const data = await client.fetch<TeamMember[]>(query);
      setTeamMembersData(data);
    };

    fetchTeam();
  }, []);

  // Categorize members
  const ceoFounder = teamMembersData.filter(m => m.role === "Leadership");
  const advisors = teamMembersData.filter(m => m.role === "Advisor");
  const teamMembers = teamMembersData.filter(m => m.role === "Team");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <div className="relative bg-[#020617] px-6 py-20 lg:py-28 text-center overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-[#C1121F]/10 px-4 py-1.5 text-sm font-bold text-[#C1121F] ring-1 ring-[#C1121F]/20 mb-8 shadow-sm tracking-wide uppercase">
            Our People
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
            The team behind the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1121F] to-red-500 italic pr-2">magic</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 leading-relaxed font-light">
             We are a diverse group of thinkers, builders, and creators united by a single mission: to build technology that matters.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-20">

        {/* First Hierarchy - CEO & Founder */}
        {ceoFounder.length > 0 && (
        <div className="mb-24 relative">
           <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 -z-10"></div>
          <div className="text-center mb-16 bg-[#F8FAFC] inline-block px-8 relative z-10 mx-auto w-full">
             <span className="text-[#C1121F] font-bold tracking-widest uppercase text-sm mb-2 block">Visionary</span>
            <h2 className="text-3xl font-extrabold text-[#020617]">Leadership</h2>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs transform hover:scale-105 transition-transform duration-500">
              <TeamMemberCard member={ceoFounder[0]} />
            </div>
          </div>
        </div>
        )}

        {/* Second Hierarchy - Advisors */}
        {advisors.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-px bg-slate-200 flex-1"></div>
             <div className="text-center">
                <span className="text-[#C1121F] font-bold tracking-widest uppercase text-sm mb-2 block">Guidance</span>
                <h2 className="text-3xl font-extrabold text-[#020617]">Advisory Board</h2>
             </div>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {advisors.map((advisor) => (
              <TeamMemberCard key={advisor._id} member={advisor} />
            ))}
          </div>
        </div>
        )}

        {/* Third Hierarchy - Team Members */}
        {teamMembers.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-px bg-slate-200 flex-1"></div>
             <div className="text-center">
                <span className="text-[#C1121F] font-bold tracking-widest uppercase text-sm mb-2 block">Execution</span>
                <h2 className="text-3xl font-extrabold text-[#020617]">The Squad</h2>
             </div>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {teamMembers.map((member, index) => {
               const isHiddenOnMobile = index >= initialSquadCount && !isSquadExpanded;
               return (
                  <TeamMemberCard 
                    key={member._id} 
                    member={member} 
                    className={isHiddenOnMobile ? "hidden md:block" : "block"}
                  />
               );
            })}
          </div>

          {/* Mobile Toggle Buttons */}
          <div className="mt-8 text-center md:hidden">
            {!isSquadExpanded && teamMembers.length > initialSquadCount && (
              <button
                onClick={() => setIsSquadExpanded(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#C1121F] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-[#A30F19] active:scale-95"
              >
                See More Team Members
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            )}
            
            {isSquadExpanded && teamMembers.length > initialSquadCount && (
              <button
                onClick={() => setIsSquadExpanded(false)}
                className="inline-flex items-center gap-2 rounded-full border border-[#C1121F] bg-white px-8 py-3 text-sm font-bold text-[#C1121F] shadow-sm transition-all hover:bg-[#C1121F]/5 active:scale-95"
              >
                Show Less
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
            )}
          </div>
        </div>
        )}

        {/* Join Us CTA */}
        <div className="mt-32 rounded-3xl bg-[#020617] p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform duration-700 group-hover:scale-110">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to make an impact?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg relative z-10">We are always looking for passionate people to join our mission. Check out our open positions.</p>
            <button className="px-10 py-4 bg-[#C1121F] hover:bg-[#A30F19] text-white font-bold rounded-full transition-all hover:shadow-[0_0_30px_rgba(193,18,31,0.4)] active:scale-95 relative z-10">
                Join our Team
            </button>
        </div>
      </div>
    </div>
  );
}
