import { ourServices } from "../../data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Breadcrumb from "../../components/Breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = ourServices.find((s) => s.id === id);
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }
 
  return {
    title: `${service.title} | Nepatronix`,
    description: service.description,
  };
}

export function generateStaticParams() {
  return ourServices.map((service) => ({
    id: service.id,
  }));
}

// --- SVG Icon Components ---
function MicroscopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 1 1-2-2V6h6v8h2" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function LabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" />
    </svg>
  );
}

function GlobalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  );
}

const ICON_MAP: Record<string, (props: { className?: string }) => React.ReactNode> = {
  microscope: (props) => <MicroscopeIcon {...props} />,
  wrench: (props) => <WrenchIcon {...props} />,
  lab: (props) => <LabIcon {...props} />,
  code: (props) => <GlobalIcon {...props} />,
  default: (props) => <MicroscopeIcon {...props} />,
};

// --- Module Icon Components ---
function RobotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" x2="8" y1="16" y2="16" /><line x1="16" x2="16" y1="16" y2="16" />
    </svg>
  );
}

function WifiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8a15 15 0 0 1 20 0" /><line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.08z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.08z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" x2="10" y1="4" y2="20" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}

function PartnerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IntegrationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-15l15 2a22 22 0 0 1-15 15z" /><path d="m11 7 8 8" /><path d="m9 11 4 4" />
    </svg>
  );
}

export default async function ServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = ourServices.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Nepatronix",
      "url": "https://nepatronix.com"
    },
    "areaServed": "Nepal",
    "category": "Technology & Education"
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nepatronix.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://nepatronix.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title,
        "item": `https://nepatronix.com/services/${id}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumb />
      {/* 1. HERO SECTION (Pristine White Theme) */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden bg-white">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C1121F]/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#020617 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <Link href="/services" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-[#C1121F] mb-6 transition-all uppercase tracking-[0.4em] group">
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-[#C1121F]/30 group-hover:bg-[#C1121F]/5 transition-all">
                  <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                Back to Services hub
              </Link>
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#C1121F]/5 px-4 py-2 text-[10px] font-black text-[#C1121F] ring-1 ring-inset ring-[#C1121F]/10 uppercase tracking-[0.3em]">
                  <span className="w-2 h-2 rounded-full bg-[#C1121F] animate-pulse"></span>
                  {service.tagline}
                </div>
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight text-[#020617]">
                  {service.title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-[#C1121F]">{service.title.split(' ').pop()}</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C1121F]"></div>
                  Global Standards
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C1121F]"></div>
                  KU Recognized
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C1121F]"></div>
                  Certified Pedagogy
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative group animate-in fade-in slide-in-from-right-8 duration-1000">
               <div className="relative flex justify-center items-center">
                  {/* Background Large Icon */}
                  <div className="absolute opacity-[0.05] transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000 select-none pointer-events-none text-slate-200">
                    {ICON_MAP[service.icon]?.({ className: "w-80 h-80 md:w-[500px] md:h-[500px]" }) ?? ICON_MAP.default({ className: "w-80 h-80 md:w-[500px] md:h-[500px]" })}
                  </div>
                  {/* Primary Foreground Icon */}
                  <div className="relative z-10 transform group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 text-[#C1121F] filter drop-shadow-[0_20px_40px_rgba(193,18,31,0.1)]">
                    {ICON_MAP[service.icon]?.({ className: "w-40 h-40 md:w-64 md:h-64" }) ?? ICON_MAP.default({ className: "w-40 h-40 md:w-64 md:h-64" })}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1 COURSE CERTIFICATION TABLE (Special for STEM Education) */}
      {(service as any).certifications && (
        <section className="py-16 px-6 bg-white overflow-hidden relative border-b border-slate-100">
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
           
           <div className="max-w-7xl mx-auto">
              {/* ... (existing content) ... */}
           </div>
        </section>
      )}

      {/* 3.2 LAB SETUP TIERS (Special for STEM Lab Setup) */}
      {(service as any).labTiers && (
        <section className="py-20 px-6 bg-white overflow-hidden relative">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                 <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Infrastructure Solutions</span>
                 <h2 className="text-4xl md:text-5xl font-black text-[#020617] tracking-tight">
                    Customized Lab <span className="text-[#C1121F]">Frameworks</span>
                 </h2>
                 <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                    We offer three distinct lab establishment tiers tailored to institutional goals, space availability, and budget requirements.
                 </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-12">
                 {(service as any).labTiers.map((tier: any, i: number) => (
                    <div key={i} className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.08)] transition-all duration-700 group relative flex flex-col items-center text-center">
                       <div className="w-24 h-24 rounded-3xl bg-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#C1121F] mb-10 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                          {i === 0 && <MicroscopeIcon className="w-10 h-10" />}
                          {i === 1 && <LabIcon className="w-10 h-10" />}
                          {i === 2 && <GlobalIcon className="w-10 h-10" />}
                       </div>
                       <h3 className="text-[10px] font-black text-[#C1121F] uppercase tracking-[0.4em] mb-6">{tier.focus}</h3>
                       <h4 className="text-2xl md:text-3xl font-black text-[#020617] mb-8 tracking-tight">{tier.name}</h4>
                       <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium px-4">{tier.description}</p>
                       
                       <div className="w-full space-y-5 text-left bg-slate-50/50 p-8 rounded-[2rem]">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Standard Features</p>
                          <div className="grid gap-4">
                             {tier.features.map((feat: string, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[#C1121F] group-hover:scale-125 transition-transform"></div>
                                   <span className="text-[13px] font-bold text-slate-700 tracking-tight">{feat}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-16 text-center">
                 <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-[#020617] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#C1121F] transition-all transform hover:-translate-y-1 shadow-2xl">
                    Request custom lab layout
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                 </Link>
              </div>
           </div>
        </section>
      )}

      {/* 3. MODULES/COMPONENTS (Technical Stack) */}
      <section className="pt-24 pb-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">
              {service.id === 'stem-lab-setup' ? 'Our Implementation Process' : 'Detailed Curriculum'}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#020617] tracking-tight">
               {service.id === 'stem-lab-setup' ? 'How We Setup ' : 'Core Modules & '}
               <span className="text-[#C1121F]">{service.id === 'stem-lab-setup' ? 'the Labs' : 'Building Blocks'}</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.id === 'stem-education' ? (
              <>
                <ModuleCard 
                  title="Robotics & Industrial Automation" 
                  desc="Focus on kinematics, sensor fusion, and actuator control. Students build autonomous systems using PID loops and real-time obstacle avoidance algorithms."
                  icon={<RobotIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="Internet of Things (IoT) Ecosystem" 
                  desc="Development of smart environments using ESP32/ESP8266. Covers MQTT server architecture, JSON data parsing, and mobile-integrated dashboards."
                  icon={<WifiIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="Applied AI & Machine Learning" 
                  desc="Introduction to Python-based ML libraries. Projects include gesture control, facial recognition, and predictive maintenance models for robotics."
                  icon={<BrainIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="Embedded System Design" 
                  desc="Comprehensive hardware engineering including schematic design, multilayer PCB layout, component selection, and professional soldering standards."
                  icon={<BoltIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="Advanced Firmware Development" 
                  desc="Low-level programming in C/C++. Topics include register-level manipulation, interrupt handling, and memory management for microcontrollers."
                  icon={<CodeIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="Mechanical CAD & Fabrication" 
                  desc="Professional 3D modeling using industry-standard tools. Slicing optimization for high-precision 3D printing and structural integrity testing."
                  icon={<BoxIcon className="w-8 h-8" />} 
                />
              </>
            ) : service.id === 'stem-lab-setup' ? (
              <>
                <ModuleCard 
                  title="1. Requirements Analysis" 
                  desc="In-depth consultation to understand institutional goals, student demographics, space availability, and budget parameters."
                  icon={<SearchIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="2. Custom Lab Design" 
                  desc="Creation of detailed 2D/3D floor plans and electrical layouts to optimize workflow, safety, and equipment placement."
                  icon={<PenIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="3. Kits & Equipment Selection" 
                  desc="Procurement of grade-appropriate STEM kits, robotics hardware, and industrial-grade prototyping tools aligned with the curriculum."
                  icon={<BoxIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="4. Technical Integration" 
                  desc="Implementation of networking, IoT hubs, and centralized management software to ensure a seamless digital learning experience."
                  icon={<IntegrationIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="5. Comprehensive Documentation" 
                  desc="Delivery of detailed SOPs, lab usage manuals, inventory logs, and safety protocols for long-term operational sustainability."
                  icon={<FileIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="6. Delivery & On-site Setup" 
                  desc="Physical installation of all hardware, final technical testing, and teacher orientation to ensure daylight-one readiness."
                  icon={<RocketIcon className="w-8 h-8" />} 
                />
              </>
            ) : (
              <>
                <ModuleCard 
                  title="Rapid Prototyping" 
                  desc="Turning concepts into industrial-grade hardware prototypes using structured R&D pipelines."
                  icon={<BoxIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
               title="Quality Assurance" 
                  desc="Rigorous testing protocols for industrial standards, ensuring high-reliability institutional deployments."
                  icon={<MicroscopeIcon className="w-8 h-8" />} 
                />
                <ModuleCard 
                  title="Scalable Infrastructure" 
                  desc="Deployments that grow with your user base, from pilot labs to nationwide STEM frameworks."
                  icon={<GlobalIcon className="w-8 h-8" />} 
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3.3 PARTNERSHIP COLLABORATION (Ecosystem Hub) */}
      <section className="pt-12 pb-24 px-6 bg-white relative overflow-hidden">
         {/* Artistic White-Value Background */}
         <div className="absolute inset-0">
            {/* Soft Ambient Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(193,18,31,0.02)_0%,transparent_70%)]"></div>
            
            {/* Ultra-Subtle Dot Matrix */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(#e2e8f0 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}></div>
         </div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
               <div className="lg:col-span-6 space-y-12">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-slate-100 bg-white shadow-sm transition-transform hover:scale-105 duration-500 cursor-default">
                        <span className="w-1 h-1 rounded-full bg-[#C1121F] animate-pulse"></span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Mutually Collaboration</span>
                     </div>
                     
                     <div className="space-y-6">
                        <h2 className="text-5xl md:text-7xl font-black text-[#020617] leading-[0.9] tracking-tighter">
                           Let's Join <br />
                           <span className="text-[#C1121F] relative inline-block">
                              Hands.
                              <svg className="absolute -bottom-2 left-0 w-full h-2 preserve-3d" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none"><path d="M1 10C50 2 150 2 299 10" stroke="#C1121F" strokeWidth="4" strokeLinecap="round" className="opacity-30" /></svg>
                           </span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                           If any <span className="text-[#020617] font-bold">Private Company, NGO, INGO, or</span> <br />
                           <span className="text-[#020617] font-bold underline decoration-[#C1121F]/30 decoration-4 underline-offset-[12px]">Government body</span> wants to establish a <span className="text-[#020617] font-bold">STEM Lab</span>, Nepatronix would love to join hands.
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col gap-5">
                     {[
                       "NATIONWIDE LAB ESTABLISHMENT",
                       "TURNKEY INFRASTRUCTURE",
                       "COLLABORATIVE R&D HUB",
                       "COMMUNITY WORKSHOP SESSIONS"
                     ].map((text, i) => (
                       <div key={i} className="flex gap-6 items-center group">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:bg-[#C1121F] group-hover:border-[#C1121F]">
                             <svg className="w-3 h-3 text-[#C1121F] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-[#020617] transition-all duration-300">{text}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
                  {[
                    { name: "NGOs & INGOs", icon: <GlobalIcon className="w-8 h-8" />, desc: "MISSION-ALIGNED IMPACT" },
                    { name: "GOVERNMENT", icon: <PartnerIcon className="w-8 h-8" />, desc: "PUBLIC SECTOR PROJECTS" },
                    { name: "PRIVATE SECTOR", icon: <BoxIcon className="w-8 h-8" />, desc: "CSR & INNOVATION LABS" },
                    { name: "ACADEMIC INST.", icon: <MicroscopeIcon className="w-8 h-8" />, desc: "RESEARCH & DEVELOPMENT" }
                  ].map((partner, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-8 py-10 rounded-[2.5rem] hover:bg-slate-50 transition-all duration-500 group flex flex-col items-center text-center shadow-[0_15px_35px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transform hover:-translate-y-2">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#C1121F] mb-8 transition-all duration-500 group-hover:bg-[#C1121F]/10 group-hover:rotate-6">
                          {partner.icon}
                       </div>
                       <h4 className="text-[#020617] font-black text-[11px] uppercase tracking-[0.2em] mb-4">{partner.name}</h4>
                       <p className="text-slate-400 text-[8px] uppercase font-bold tracking-[0.15em] leading-relaxed max-w-[120px]">{partner.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}

function ModuleCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-50 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.06)] transition-all duration-700 group flex flex-col items-center text-center relative overflow-hidden transform hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-[#C1121F]/20">
      {/* Precision White Icon Container */}
      <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#C1121F] mb-8 relative group-hover:scale-105 transition-all duration-500">
         <div className="relative z-10 transform scale-100">{icon}</div>
      </div>

      <h3 className="text-lg md:text-xl font-black text-[#020617] mb-4 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-500 text-[12px] leading-relaxed max-w-[210px] font-medium opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
    </div>
  );
}
