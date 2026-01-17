"use client";

import { useState } from "react";
import Image from "next/image";

export default function ServiceLabGallery() {
  const [activeTab, setActiveTab] = useState("all");

  const labs = [
    {
      id: 1,
      title: "Robotics Workstation",
      category: "Robotics",
      description: "Complete workbench setup with soldering stations and tools.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd90f9?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "3D Printing Zone",
      category: "Makerspace",
      description: "Industrial grade 3D printers for rapid prototyping.",
      image: "https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "IoT & Electronics",
      category: "Electronics",
      description: "Sensor kits, microcontrollers, and testing equipment.",
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "AI & Coding Hub",
      category: "Computer Lab",
      description: "High-performance computing units for AI model training.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="px-8 sm:px-12 py-16 bg-[#F8FAFF] border-t border-[#E6EBF2]">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B3C74] mb-4">
          Lab Configurations
        </h2>
        <div className="h-1 w-16 bg-[#C4161C] rounded-full mx-auto"></div>
        <p className="mt-4 text-[#5F6C7B] max-w-2xl mx-auto">
          Take a look at our standardized lab setups designed for schools and colleges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E6EBF2] hover:border-[#0B3C74]/30 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#0B3C74]/90 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase tracking-wider">
                    {lab.category}
                </div>
                <Image
                src={lab.image}
                alt={lab.title}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
            </div>
            
            <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B3C74] mb-2 group-hover:text-[#C4161C] transition-colors">
                    {lab.title}
                </h3>
                <p className="text-[#5F6C7B] text-sm leading-relaxed">
                    {lab.description}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
