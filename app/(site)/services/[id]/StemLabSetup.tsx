"use client";

import { useState } from "react";
import Link from "next/link";

interface LabTier {
  name: string;
  focus: string;
  description: string;
  features: string[];
}

interface LabService {
  title: string;
  tagline: string;
  overview: string;
  description: string;
  labTiers?: LabTier[];
  scopeOfServices?: string[];
  impact?: string[];
}

/* ── Professional line icons ─────────────────────────────────────── */
type IconProps = { className?: string };
const svgBase = (className?: string) => ({
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});
const CheckIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M20 6L9 17l-5-5" /></svg>
);
const SearchIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
const PenIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
);
const BoxIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" /><path d="M3.3 7L12 12l8.7-5M12 12v10" /></svg>
);
const NetworkIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
);
const FileIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M14 3v4a1 1 0 001 1h4" /><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" /><path d="M9 13h6M9 17h6" /></svg>
);
const RocketIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1z" /><path d="M12 15l-3-3a22 22 0 012-15l15 2a22 22 0 01-15 15z" /><path d="M11 7l8 8" /></svg>
);
const LabIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-2.5L14 9V3" /></svg>
);
const MicroscopeIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M6 18h8M3 22h18M14 22a7 7 0 100-14h-1M9 14h2" /><path d="M9 12a2 2 0 11-2-2V6h6v8h2" /></svg>
);
const GlobeIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9S14.5 18.4 12 21C9.5 18.4 8.2 15.2 8.2 12S9.5 5.6 12 3z" /></svg>
);
const ChartIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" /></svg>
);
const ShieldIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
);
const UsersIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-4-5.6" /></svg>
);
const LayersIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
);
const WrenchIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z" /></svg>
);
const ArrowIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const SparkIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></svg>
);

const STATS = [
  { value: "3", label: "Lab tiers", icon: LayersIcon },
  { value: "6", label: "Implementation steps", icon: WrenchIcon },
  { value: "End-to-end", label: "Design to handover", icon: RocketIcon },
  { value: "Teacher-ready", label: "Orientation included", icon: UsersIcon },
];

const PROCESS = [
  { icon: SearchIcon, title: "Requirements Analysis", desc: "Consultation on institutional goals, student demographics, space, and budget." },
  { icon: PenIcon, title: "Custom Lab Design", desc: "2D/3D floor plans and electrical layouts optimised for safety and workflow." },
  { icon: BoxIcon, title: "Kits & Equipment", desc: "Grade-appropriate STEM kits, robotics hardware, and prototyping tools." },
  { icon: NetworkIcon, title: "Technical Integration", desc: "Networking, IoT hubs, and management software for a seamless lab." },
  { icon: FileIcon, title: "Documentation", desc: "SOPs, usage manuals, inventory logs, and safety protocols." },
  { icon: RocketIcon, title: "Delivery & Setup", desc: "On-site installation, testing, and teacher orientation for day-one readiness." },
];

const INCLUDES = [
  { icon: LabIcon, text: "Modular, scalable lab furniture & workstations" },
  { icon: BoxIcon, text: "Curriculum-aligned kits and equipment packages" },
  { icon: NetworkIcon, text: "Power, networking & IoT hub planning" },
  { icon: ShieldIcon, text: "Safety protocols and operational SOPs" },
  { icon: UsersIcon, text: "Teacher orientation and lab training" },
  { icon: FileIcon, text: "Inventory logs and handover documentation" },
];

const WHY = [
  { icon: SparkIcon, title: "Experience-first labs", desc: "Spaces designed so students learn by building, testing, and iterating." },
  { icon: LayersIcon, title: "Modular & scalable", desc: "Start with a foundational setup and expand as enrolment and goals grow." },
  { icon: ShieldIcon, title: "Standards-aligned", desc: "Layouts and kits mapped to local and international academic frameworks." },
  { icon: WrenchIcon, title: "Turnkey delivery", desc: "From design drawings to installed, tested, teacher-ready labs." },
];

const TIER_ICONS = [MicroscopeIcon, LabIcon, GlobeIcon];
const TIER_LEVELS = ["Foundational", "Intermediate", "Advanced"];

export default function StemLabSetup({ service }: { service: LabService }) {
  const tiers = service.labTiers ?? [];
  const scope = service.scopeOfServices ?? [];
  const impact = service.impact ?? [];
  const [activeTier, setActiveTier] = useState(Math.min(1, Math.max(0, tiers.length - 1)));
  const [activeStep, setActiveStep] = useState(0);

  const selected = tiers[activeTier];

  return (
    <>
      {/* ── HERO (full-bleed, matches other service heroes) ─── */}
      <section className="relative bg-[#020617] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[#C1121F]/15 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[110px] rounded-full -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 0.6px, transparent 0.6px)", backgroundSize: "30px 30px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C1121F]/15 border border-[#C1121F]/30 px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7a85]">{service.tagline}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-4xl">
                STEM Lab <span className="text-[#ff4d5a]">Setup</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: LayersIcon, text: "3 scalable tiers" },
                  { icon: WrenchIcon, text: "Turnkey delivery" },
                  { icon: ShieldIcon, text: "Standards aligned" },
                  { icon: UsersIcon, text: "Teacher training" },
                ].map((chip) => (
                  <span key={chip.text} className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                    <chip.icon className="w-4 h-4 text-[#ff7a85]" />
                    {chip.text}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] font-bold text-sm shadow-lg shadow-[#C1121F]/40 transition-all">
                  Request a lab quote <ArrowIcon className="w-4 h-4" />
                </Link>
                <Link href="/services/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-sm transition-colors">
                  Explore programs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-7 space-y-5">
                <LabIcon className="w-9 h-9 text-[#ff4d5a]" />
                <p className="text-lg font-bold leading-relaxed">
                  From design drawings to installed, tested, teacher-ready labs — modular, scalable, and day-one ready.
                </p>
                <ul className="space-y-3">
                  {["Custom lab design", "Kits & equipment", "On-site installation", "Teacher orientation"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center flex-shrink-0">
                <s.icon className="w-6 h-6" />
              </span>
              <div>
                <p className="text-2xl font-black text-[#020617] tracking-tight">{s.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Lab Infrastructure</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight leading-tight">
              Where learning becomes <span className="text-[#C1121F]">experience</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">{service.overview}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["Custom design", "Scalable tiers", "Teacher training", "Day-one ready"].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[2.5rem] bg-[#020617] p-10 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-16 w-56 h-56 bg-[#C1121F]/25 blur-[70px] rounded-full" />
              <div className="relative z-10 space-y-6">
                <LabIcon className="w-10 h-10 text-[#ff4d5a]" />
                <p className="text-lg font-bold leading-relaxed">{service.description}</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#ff7a85] hover:text-white transition-colors">
                  Request a lab quote <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAB TIERS (interactive) ──────────────────────────── */}
      {tiers.length > 0 && selected && (
        <section className="py-20 px-6 bg-slate-50/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Infrastructure Solutions</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">
                Customized lab <span className="text-[#C1121F]">frameworks</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                Choose a tier to match your goals, space, and budget — then scale as you grow.
              </p>
            </div>

            {/* Tier selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {tiers.map((tier, i) => (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => setActiveTier(i)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    activeTier === i
                      ? "bg-[#C1121F] text-white shadow-lg shadow-[#C1121F]/30"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-[#C1121F]/40"
                  }`}
                >
                  {TIER_LEVELS[i] ?? `Tier ${i + 1}`}
                </button>
              ))}
            </div>

            {/* Selected tier detail */}
            <div className="rounded-[2.5rem] bg-white border border-slate-200 shadow-lg overflow-hidden mb-10">
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-5 bg-[#020617] p-10 md:p-12 text-white relative overflow-hidden">
                  <div className="absolute -bottom-16 -right-10 w-48 h-48 bg-[#C1121F]/30 blur-[60px] rounded-full" />
                  <div className="relative z-10">
                    {(() => {
                      const Icon = TIER_ICONS[activeTier] ?? LabIcon;
                      return (
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                          <Icon className="w-8 h-8 text-[#ff7a85]" />
                        </div>
                      );
                    })()}
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7a85] mb-3">{selected.focus}</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4">{selected.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{selected.description}</p>
                  </div>
                </div>
                <div className="lg:col-span-7 p-10 md:p-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Standard features</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selected.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-bold text-slate-800">{feat}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] text-white text-sm font-bold transition-colors">
                      Request this setup <ArrowIcon className="w-4 h-4" />
                    </Link>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors">
                      Custom lab layout
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* All tiers grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {tiers.map((tier, i) => {
                const Icon = TIER_ICONS[i] ?? LabIcon;
                return (
                  <button
                    key={tier.name}
                    type="button"
                    onClick={() => setActiveTier(i)}
                    className={`text-left rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 ${
                      activeTier === i
                        ? "border-[#C1121F] shadow-lg ring-2 ring-[#C1121F]/10 -translate-y-1"
                        : "border-slate-100 hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C1121F] mb-2">{tier.focus}</p>
                    <h4 className="text-lg font-black text-[#020617] mb-3 tracking-tight">{tier.name}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{tier.description}</p>
                    <p className="text-xs font-semibold text-slate-400">{tier.features.length} standard features</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── IMPLEMENTATION PROCESS ───────────────────────────── */}
      <section className="py-20 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C1121F]/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#ff7a85] font-black uppercase tracking-[0.4em] text-[10px]">Our Implementation Process</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">How we set up the labs</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium">
              A proven six-step process from needs analysis to day-one readiness.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {PROCESS.map((step, i) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeStep === i
                    ? "bg-[#C1121F] text-white shadow-lg shadow-[#C1121F]/30"
                    : "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/15"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-10 mb-8 flex flex-col md:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#C1121F] text-white flex items-center justify-center flex-shrink-0">
              {(() => {
                const Icon = PROCESS[activeStep].icon;
                return <Icon className="w-8 h-8" />;
              })()}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7a85] mb-2">Step {String(activeStep + 1).padStart(2, "0")}</p>
              <h3 className="text-2xl font-black text-white mb-3">{PROCESS[activeStep].title}</h3>
              <p className="text-slate-300 leading-relaxed max-w-3xl">{PROCESS[activeStep].desc}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS.map((step, i) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`text-left rounded-3xl border p-6 transition-all ${
                  activeStep === i
                    ? "bg-white/10 border-[#C1121F]/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeStep === i ? "bg-[#C1121F] text-white" : "bg-white/10 text-slate-300"}`}>
                    <step.icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-black text-white/30">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="text-white font-bold text-sm mb-2">{step.title}</h4>
                <p className="text-slate-400 text-[13px] leading-relaxed">{step.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">What&apos;s Included</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">A complete lab package</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDES.map((item) => (
              <div key={item.text} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:bg-white hover:shadow-md transition-all">
                <span className="w-11 h-11 rounded-xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </span>
                <p className="text-sm font-semibold text-slate-700 leading-snug pt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Why Nepatronix</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Labs engineered for lasting use</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#C1121F] text-white flex items-center justify-center mb-5">
                  <w.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#020617] mb-2 tracking-tight">{w.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCOPE + IMPACT ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
          {scope.length > 0 && (
            <div>
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Scope of Services</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight mt-3 mb-8">What we deliver</h2>
              <div className="space-y-4">
                {scope.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <CheckIcon className="w-5 h-5" />
                    </span>
                    <p className="text-slate-700 font-semibold leading-snug pt-1.5">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {impact.length > 0 && (
            <div>
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Outcomes</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight mt-3 mb-8">The impact we create</h2>
              <div className="space-y-4">
                {impact.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C1121F] text-white flex items-center justify-center">
                      <ChartIcon className="w-5 h-5" />
                    </span>
                    <p className="text-slate-700 font-semibold leading-snug pt-1.5">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
