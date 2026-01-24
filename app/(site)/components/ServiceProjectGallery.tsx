"use client";

import Image from "next/image";

export default function ServiceProjectGallery() {
  const projects = [
    {
      id: 1,
      title: "Global E-Commerce Platform",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Fintech Mobile App",
      category: "App Development",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "HealthTech Dashboard",
      category: "Software Solutions",
      image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=800&auto=format&fit=crop"
    },
     {
      id: 4,
      title: "Smart Home Controller",
      category: "IoT Integration",
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="px-8 sm:px-12 py-16 bg-white border-t border-[#E6EBF2]">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B3C74] mb-4">
          Featured Projects
        </h2>
        <div className="h-1 w-16 bg-[#C4161C] rounded-full mx-auto"></div>
        <p className="mt-4 text-[#5F6C7B] max-w-2xl mx-auto">
          Showcasing our innovation and technical expertise across industries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-2xl overflow-hidden shadow-lg aspect-video hover:shadow-2xl transition-all duration-500"
          >
           
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C74] via-transparent to-transparent opacity-90 transition-opacity z-10" />
            
            <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 bg-[#C4161C] text-white text-xs font-bold rounded-full mb-3 shadow-md">
                    {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
            </div>
            
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
