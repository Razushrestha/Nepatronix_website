"use client";

import { useState } from "react";
import Link from "next/link";

interface Certification {
  name: string;
  hrs: string;
  delivery: string;
  exam: string;
}

interface StemService {
  title: string;
  tagline: string;
  overview: string;
  programGoal?: string;
  keyObjectives?: string[];
  targetAudiance?: string[];
  certifications?: Certification[];
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
const TargetIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg>
);
const CheckIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M20 6L9 17l-5-5" /></svg>
);
const RobotIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><rect x="4" y="8" width="16" height="10" rx="2" /><circle cx="12" cy="4" r="1.5" /><path d="M12 5.5V8M9 13h.01M15 13h.01M9 21h6" /></svg>
);
const WifiIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M5 13a10 10 0 0114 0M8.5 16.5a5 5 0 017 0M2 8a15 15 0 0120 0" /><circle cx="12" cy="20" r="0.6" fill="currentColor" /></svg>
);
const BrainIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M9.5 3A2.5 2.5 0 007 5.5 3 3 0 005 11a3 3 0 002 5.5V19a2 2 0 004 0V5.5A2.5 2.5 0 009.5 3z" /><path d="M14.5 3A2.5 2.5 0 0117 5.5 3 3 0 0119 11a3 3 0 01-2 5.5V19a2 2 0 01-4 0" /></svg>
);
const BoltIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
const CodeIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16" /></svg>
);
const CubeIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" /><path d="M3.3 7L12 12l8.7-5M12 12v10" /></svg>
);
const UsersIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-4-5.6" /></svg>
);
const ChartIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" /></svg>
);
const ClockIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const MonitorIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></svg>
);
const ClipboardIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 13l2 2 4-4" /></svg>
);
const AwardIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" /></svg>
);
const ArrowIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const BookIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z" /><path d="M18 3v18" /></svg>
);
const FlaskIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-2.5L14 9V3" /></svg>
);
const ShieldIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
);
const LayersIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
);
const SparkIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></svg>
);
const ChevronIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M6 9l6 6 6-6" /></svg>
);

const STATS = [
  { value: "5+", label: "Certified programs", icon: AwardIcon },
  { value: "6", label: "Core curriculum modules", icon: LayersIcon },
  { value: "35–61", label: "Hours per pathway", icon: ClockIcon },
  { value: "100%", label: "Hands-on project focus", icon: FlaskIcon },
];

const MODULES = [
  { icon: RobotIcon, title: "Robotics & Industrial Automation", desc: "Kinematics, sensor fusion, and actuator control. Learners build autonomous systems using PID loops and real-time obstacle avoidance." },
  { icon: WifiIcon, title: "Internet of Things (IoT)", desc: "Smart environments with ESP32/ESP8266 — MQTT architecture, JSON data parsing, and mobile-integrated dashboards." },
  { icon: BrainIcon, title: "Applied AI & Machine Learning", desc: "Python-based ML: gesture control, facial recognition, and predictive maintenance models for robotics." },
  { icon: BoltIcon, title: "Embedded System Design", desc: "Schematic design, multilayer PCB layout, component selection, and professional soldering standards." },
  { icon: CodeIcon, title: "Advanced Firmware Development", desc: "Low-level C/C++: register-level manipulation, interrupt handling, and memory management for microcontrollers." },
  { icon: CubeIcon, title: "Mechanical CAD & Fabrication", desc: "Industry-standard 3D modeling, slicing optimization for precision 3D printing, and structural testing." },
];

const PATHWAY = [
  { step: "01", title: "Orient & Assess", desc: "Baseline skills check, program selection, and learning goals aligned to your role." },
  { step: "02", title: "Learn by Building", desc: "Structured modules with labs, kits, and real projects — not slide-only theory." },
  { step: "03", title: "Teach & Apply", desc: "Pedagogy practice, classroom techniques, and school-ready delivery frameworks." },
  { step: "04", title: "Certify & Grow", desc: "Assessment, certification, and continuous improvement for long-term impact." },
];

const WHY_US = [
  { icon: BookIcon, title: "Globally aligned curriculum", desc: "STEM frameworks mapped to modern standards with local classroom relevance." },
  { icon: FlaskIcon, title: "Project-first pedagogy", desc: "Every concept is reinforced through hands-on builds and measurable outcomes." },
  { icon: ShieldIcon, title: "Recognised certification", desc: "National and international certification pathways with flexible exam modes." },
  { icon: SparkIcon, title: "Teacher + student ready", desc: "Programs designed for tutors, coordinators, and learners — not one-size-fits-all." },
];

export default function StemEducation({ service }: { service: StemService }) {
  const objectives = service.keyObjectives ?? [];
  const audience = service.targetAudiance ?? [];
  const certs = service.certifications ?? [];
  const scope = service.scopeOfServices ?? [];
  const impact = service.impact ?? [];

  const [activeCert, setActiveCert] = useState(0);
  const [openObjective, setOpenObjective] = useState(0);
  const [activeModule, setActiveModule] = useState(0);

  const selectedCert = certs[activeCert];

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
                Certified STEM Education{" "}
                <span className="text-[#ff4d5a]">Solution</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                {service.overview || service.tagline}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: ShieldIcon, text: "Global standards" },
                  { icon: AwardIcon, text: "KU recognized" },
                  { icon: BookIcon, text: "Certified pedagogy" },
                  { icon: FlaskIcon, text: "Hands-on learning" },
                ].map((chip) => (
                  <span key={chip.text} className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                    <chip.icon className="w-4 h-4 text-[#ff7a85]" />
                    {chip.text}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/services/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] font-bold text-sm shadow-lg shadow-[#C1121F]/40 transition-all">
                  Browse courses <ArrowIcon className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-sm transition-colors">
                  Talk to us
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-7 space-y-5">
                <AwardIcon className="w-9 h-9 text-[#ff4d5a]" />
                <p className="text-lg font-bold leading-relaxed">
                  Globally aligned STEM for students and teachers — hands-on projects, real-world problem solving, and recognised certification.
                </p>
                <ul className="space-y-3">
                  {["Teacher training pathways", "Project-based curriculum", "National & international certs", "Classroom-ready delivery"].map((item) => (
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

      {/* ── STATS STRIP ──────────────────────────────────────── */}
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

      {/* ── PROGRAM GOAL ─────────────────────────────────────── */}
      {service.programGoal && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Program Goal</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight leading-tight">
                Practical, certified &amp; <span className="text-[#C1121F]">future-ready</span> STEM
              </h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">{service.programGoal}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["Hands-on labs", "Teacher training", "Science + Math integration", "Sustainable tutoring models"].map((tag) => (
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
                  <TargetIcon className="w-10 h-10 text-[#ff4d5a]" />
                  <p className="text-lg font-bold leading-relaxed">{service.overview}</p>
                  <Link href="/services/courses" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#ff7a85] hover:text-white transition-colors">
                    Browse courses <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LEARNING PATHWAY ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C1121F]/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#ff7a85] font-black uppercase tracking-[0.4em] text-[10px]">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">A clear learning pathway</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium">
              From orientation to certification — every stage is designed for measurable skill growth.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATHWAY.map((p) => (
              <div key={p.step} className="rounded-3xl bg-white/5 border border-white/10 p-7 hover:bg-white/10 transition-colors">
                <span className="text-4xl font-black text-white/15">{p.step}</span>
                <h3 className="text-white font-bold text-base mt-3 mb-2">{p.title}</h3>
                <p className="text-slate-400 text-[13px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY OBJECTIVES (accordion) ───────────────────────── */}
      {objectives.length > 0 && (
        <section className="py-20 px-6 bg-slate-50/60">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">What You&apos;ll Achieve</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Key learning objectives</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Nine outcomes that transform technical skill, classroom delivery, and program sustainability.
              </p>
            </div>
            <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {objectives.map((obj, i) => {
                const open = openObjective === i;
                return (
                  <div key={i} className="border-b border-slate-100 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenObjective(open ? -1 : i)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${open ? "bg-[#C1121F] text-white" : "bg-slate-100 text-slate-500"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-900">{obj}</span>
                      <ChevronIcon className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 pl-[4.5rem]">
                        <p className="text-sm text-slate-500 leading-relaxed">
                          This objective is reinforced through guided practice, peer feedback, and project checkpoints across the program.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CERTIFICATION PROGRAMS (interactive) ─────────────── */}
      {certs.length > 0 && selectedCert && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Certification Programs</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Structured, certified pathways</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                Select a program to view duration, delivery mode, and assessment details.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Program list */}
              <div className="lg:col-span-5 space-y-3">
                {certs.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveCert(i)}
                    className={`w-full text-left rounded-2xl border px-5 py-4 transition-all ${
                      activeCert === i
                        ? "border-[#C1121F] bg-[#C1121F]/5 shadow-md"
                        : "border-slate-200 bg-white hover:border-[#C1121F]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${activeCert === i ? "bg-[#C1121F] text-white" : "bg-slate-100 text-slate-500"}`}>
                        {i + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900 leading-snug">{c.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Detail panel */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10 shadow-sm">
                <div className="flex items-start gap-3 mb-6">
                  <AwardIcon className="w-8 h-8 text-[#C1121F] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-black text-[#020617] leading-tight">{selectedCert.name}</h3>
                    <p className="text-slate-500 text-sm mt-2">Flexible delivery with national &amp; international certification options.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: ClockIcon, label: "Duration", value: `${selectedCert.hrs} hours` },
                    { icon: MonitorIcon, label: "Delivery", value: selectedCert.delivery },
                    { icon: ClipboardIcon, label: "Exam mode", value: selectedCert.exam },
                  ].map((f) => (
                    <div key={f.label} className="rounded-2xl bg-white border border-slate-100 p-5">
                      <f.icon className="w-5 h-5 text-[#C1121F] mb-3" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{f.label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/services/courses" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] text-white text-sm font-bold transition-colors">
                    View all courses <ArrowIcon className="w-4 h-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:border-[#C1121F]/40 text-slate-700 text-sm font-bold transition-colors">
                    Ask about certification
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 max-w-3xl mx-auto">
              <AwardIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 text-sm font-medium">
                National &amp; international certification available. Pricing varies with the chosen certification level.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── CORE MODULES (interactive) ───────────────────────── */}
      <section className="py-20 px-6 bg-slate-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Detailed Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Core modules &amp; building blocks</h2>
          </div>

          {/* Tabs on desktop */}
          <div className="hidden lg:flex flex-wrap justify-center gap-2 mb-8">
            {MODULES.map((m, i) => (
              <button
                key={m.title}
                type="button"
                onClick={() => setActiveModule(i)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeModule === i
                    ? "bg-[#C1121F] text-white shadow-lg shadow-[#C1121F]/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#C1121F]/40"
                }`}
              >
                {m.title.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Featured module (desktop) */}
          <div className="hidden lg:block mb-8">
            {MODULES[activeModule] && (
              <div className="rounded-3xl bg-white border border-slate-200 p-10 shadow-sm flex items-start gap-8">
                <div className="w-20 h-20 rounded-2xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const Icon = MODULES[activeModule].icon;
                    return <Icon className="w-10 h-10" />;
                  })()}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C1121F] mb-2">Module {String(activeModule + 1).padStart(2, "0")}</p>
                  <h3 className="text-2xl font-black text-[#020617] mb-3">{MODULES[activeModule].title}</h3>
                  <p className="text-slate-500 leading-relaxed max-w-3xl">{MODULES[activeModule].desc}</p>
                </div>
              </div>
            )}
          </div>

          {/* Grid (all viewports) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, i) => (
              <button
                key={m.title}
                type="button"
                onClick={() => setActiveModule(i)}
                className={`text-left bg-white rounded-3xl border p-8 shadow-sm transition-all duration-300 group ${
                  activeModule === i ? "border-[#C1121F] shadow-lg ring-2 ring-[#C1121F]/10" : "border-slate-100 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <m.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-[#020617] mb-3 tracking-tight leading-tight">{m.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Why Nepatronix</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Built for real classroom impact</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((w) => (
              <div key={w.title} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-7 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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

      {/* ── TARGET AUDIENCE ──────────────────────────────────── */}
      {audience.length > 0 && (
        <section className="py-20 px-6 bg-slate-50/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 space-y-3">
              <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Who It&apos;s For</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Designed for every STEM changemaker</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {audience.map((a, i) => (
                <div key={i} className="inline-flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-sm hover:border-[#C1121F]/30 hover:shadow-md transition-all">
                  <span className="w-9 h-9 rounded-xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center">
                    <UsersIcon className="w-5 h-5" />
                  </span>
                  <span className="font-bold text-slate-800 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
