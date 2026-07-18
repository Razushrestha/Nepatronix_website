"use client";

import { useState } from "react";
import Link from "next/link";

interface InstitutionalService {
  title: string;
  tagline: string;
  overview: string;
  description: string;
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
const GovIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M3 21h18M4 10h16M5 10V21M19 10V21M9 10V21M15 10V21M12 3l8 4H4l8-4z" /></svg>
);
const GlobeIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9S14.5 18.4 12 21C9.5 18.4 8.2 15.2 8.2 12S9.5 5.6 12 3z" /></svg>
);
const BriefcaseIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" /></svg>
);
const AcademicIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 4L2 9l10 5 10-5-10-5z" /><path d="M6 11.5V16c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5" /></svg>
);
const CheckIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M20 6L9 17l-5-5" /></svg>
);
const TargetIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg>
);
const MapIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></svg>
);
const KeyIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="7.5" cy="15.5" r="3.5" /><path d="M10 13l8-8 3 3-3 3M14.5 8.5l2 2" /></svg>
);
const ShieldIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
);
const ChartIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" /></svg>
);
const HandshakeIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M11 17l2 2a1.5 1.5 0 002-2M8 14l2.5 2.5M3 11l4-4 4 3 3-3 6 6-2 2-3-2" /><path d="M3 11l3 3M21 11l-3 3" /></svg>
);
const ArrowIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const UsersIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-4-5.6" /></svg>
);
const LayersIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
);
const ClipboardIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 13l2 2 4-4" /></svg>
);
const BookIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z" /><path d="M18 3v18" /></svg>
);
const LabIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-2.5L14 9V3" /></svg>
);
const RocketIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1z" /><path d="M12 15l-3-3a22 22 0 012-15l15 2a22 22 0 01-15 15z" /></svg>
);
const ChevronIcon = ({ className }: IconProps) => (
  <svg {...svgBase(className)}><path d="M6 9l6 6 6-6" /></svg>
);

const STATS = [
  { value: "Nationwide", label: "Program reach", icon: MapIcon },
  { value: "End-to-end", label: "Design to M&E", icon: KeyIcon },
  { value: "SDG-aligned", label: "Global frameworks", icon: ShieldIcon },
  { value: "Measurable", label: "Impact reporting", icon: ChartIcon },
];

const WHO_WE_SERVE = [
  {
    icon: GovIcon,
    name: "Government Bodies",
    desc: "Ministries, municipalities, and public education authorities rolling out national STEM initiatives.",
    focus: ["National curriculum rollouts", "Teacher capacity missions", "Public lab networks"],
  },
  {
    icon: GlobeIcon,
    name: "NGOs & INGOs",
    desc: "Development partners delivering mission-aligned education and skills programs at scale.",
    focus: ["Donor-aligned frameworks", "Inclusive community programs", "Field-ready training"],
  },
  {
    icon: BriefcaseIcon,
    name: "CSR & Private Sector",
    desc: "Corporates funding social-impact STEM labs and community innovation programs.",
    focus: ["CSR STEM labs", "Workforce readiness", "Brand-linked impact"],
  },
  {
    icon: AcademicIcon,
    name: "Academic Institutions",
    desc: "Universities and school networks standardising STEM across multiple campuses.",
    focus: ["Multi-campus standards", "Faculty development", "Shared lab models"],
  },
];

const APPROACH = [
  { icon: ClipboardIcon, title: "Needs Assessment", desc: "Baseline study of institutional goals, learner demographics, infrastructure gaps, and budget parameters." },
  { icon: BookIcon, title: "Program Design", desc: "Custom curriculum, delivery model, and rollout roadmap aligned to national and global standards." },
  { icon: LabIcon, title: "Deployment & Training", desc: "Lab setup, kit distribution, and intensive teacher capacity-building on the ground." },
  { icon: ChartIcon, title: "Monitoring & Evaluation", desc: "Continuous tracking against defined KPIs with structured feedback loops and field visits." },
  { icon: RocketIcon, title: "Impact Reporting", desc: "Transparent reporting, data dashboards, and recommendations for sustained scale-up." },
];

const OFFERINGS = [
  { icon: MapIcon, title: "Nationwide STEM programs", desc: "Regional and national implementations with standardised quality and local adaptation." },
  { icon: UsersIcon, title: "Teacher capacity building", desc: "Intensive trainer-of-trainers models so institutions can sustain delivery independently." },
  { icon: LabIcon, title: "Lab & kit deployment", desc: "Turnkey STEM labs, kits, and classroom infrastructure matched to program goals." },
  { icon: ChartIcon, title: "M&E and reporting", desc: "Baseline, midline, and endline measurement with partner-ready documentation." },
  { icon: LayersIcon, title: "Inclusive interventions", desc: "Community-focused designs that expand access for girls, rural schools, and underserved regions." },
  { icon: HandshakeIcon, title: "Partnership management", desc: "Single-point coordination across government, NGO, and private stakeholders." },
];

const ENGAGEMENT = [
  {
    title: "Pilot Program",
    subtitle: "Prove the model",
    points: ["1–3 institutions or districts", "Baseline + endline assessment", "Teacher cohort training", "Pilot impact brief"],
  },
  {
    title: "Scale-Up Partnership",
    subtitle: "Expand with confidence",
    points: ["Multi-district / multi-campus rollout", "Standard operating procedures", "Master trainer pipeline", "Quarterly M&E dashboards"],
  },
  {
    title: "National Framework",
    subtitle: "System-level delivery",
    points: ["Policy-aligned curriculum package", "Nationwide logistics & deployment", "Institutional sustainability plan", "Full impact & donor reporting"],
  },
];

const KPIS = [
  { label: "Teachers trained", detail: "Certified capacity cohorts" },
  { label: "Students reached", detail: "Direct classroom engagement" },
  { label: "Labs established", detail: "Functional STEM spaces" },
  { label: "Completion rate", detail: "Program fidelity metrics" },
  { label: "Gender inclusion", detail: "Participation equity tracking" },
  { label: "Sustainability score", detail: "Post-handover readiness" },
];

const SDGS = [
  { code: "04", name: "Quality Education", desc: "Inclusive, equitable STEM learning for every learner." },
  { code: "09", name: "Industry & Innovation", desc: "Infrastructure and innovation capacity for the future of work." },
  { code: "10", name: "Reduced Inequalities", desc: "Expanding access beyond urban centres and privileged schools." },
  { code: "17", name: "Partnerships", desc: "Multi-stakeholder collaboration for scalable national impact." },
];

const FAQS = [
  {
    q: "Who typically funds these programs?",
    a: "Government ministries, municipalities, NGOs/INGOs, CSR foundations, and school networks. We tailor proposals and budgets to each partner’s compliance and reporting needs.",
  },
  {
    q: "Can you start with a small pilot?",
    a: "Yes. Most national partnerships begin with a focused pilot — a few schools or a single district — then scale using evidence from baseline and endline results.",
  },
  {
    q: "Do you provide teacher training and labs together?",
    a: "Absolutely. Our strongest models combine infrastructure (labs/kits) with teacher capacity building, SOPs, and ongoing mentoring so the investment lasts.",
  },
  {
    q: "How do you measure impact?",
    a: "We define KPIs upfront, collect baseline data, track delivery fidelity, and deliver midline/endline reports with dashboards suitable for donors and ministries.",
  },
];

export default function InstitutionalPrograms({ service }: { service: InstitutionalService }) {
  const scope = service.scopeOfServices ?? [];
  const impact = service.impact ?? [];

  const [activePartner, setActivePartner] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [activeEngagement, setActiveEngagement] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);

  const partner = WHO_WE_SERVE[activePartner];
  const step = APPROACH[activeStep];

  return (
    <>
      {/* ── HERO (full-bleed, matches site dark heroes) ─────── */}
      <section className="relative bg-[#020617] pt-32 pb-20 overflow-hidden -mt-[1px]">
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
                Government, NGO &amp;{" "}
                <span className="text-[#ff4d5a]">CSR Programs</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: MapIcon, text: "Nationwide reach" },
                  { icon: KeyIcon, text: "Turnkey delivery" },
                  { icon: ShieldIcon, text: "SDG aligned" },
                  { icon: ChartIcon, text: "Measurable M&E" },
                ].map((chip) => (
                  <span key={chip.text} className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                    <chip.icon className="w-4 h-4 text-[#ff7a85]" />
                    {chip.text}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] font-bold text-sm shadow-lg shadow-[#C1121F]/40 transition-all">
                  Start a partnership <ArrowIcon className="w-4 h-4" />
                </Link>
                <Link href="/services/stem-lab-setup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-sm transition-colors">
                  Explore lab setup
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-7 space-y-5">
                <TargetIcon className="w-9 h-9 text-[#ff4d5a]" />
                <p className="text-lg font-bold leading-relaxed">
                  From pilot programs to nationwide rollouts — design, deployment, training, and measurement, end-to-end.
                </p>
                <ul className="space-y-3">
                  {["Needs assessment", "Program design", "Deployment & training", "Impact reporting"].map((item) => (
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
                <p className="text-xl font-black text-[#020617] tracking-tight">{s.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Program Overview</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight leading-tight">
              Large-scale STEM, engineered for <span className="text-[#C1121F]">national impact</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">{service.overview}</p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              We co-create programs with ministries, NGOs, INGOs, and CSR partners — combining curriculum, labs, teacher training, and rigorous monitoring so every investment produces lasting institutional capacity.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { icon: GovIcon, label: "Public sector ready" },
              { icon: GlobeIcon, label: "Donor compliant" },
              { icon: UsersIcon, label: "Trainer pipelines" },
              { icon: ClipboardIcon, label: "Audit-ready reports" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:bg-white hover:shadow-md transition-all">
                <item.icon className="w-6 h-6 text-[#C1121F] mb-3" />
                <p className="text-sm font-bold text-slate-800 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE (interactive) ───────────────────────── */}
      <section className="py-20 px-6 bg-slate-50/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Who We Partner With</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Built for institutional partners</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium">
              Select a partner type to see how we typically engage and deliver.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {WHO_WE_SERVE.map((w, i) => (
              <button
                key={w.name}
                type="button"
                onClick={() => setActivePartner(i)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  activePartner === i
                    ? "bg-[#C1121F] text-white shadow-lg shadow-[#C1121F]/30"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#C1121F]/40"
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>

          <div className="rounded-[2.5rem] bg-white border border-slate-200 shadow-lg overflow-hidden mb-8">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-5 bg-[#020617] p-10 md:p-12 text-white relative overflow-hidden">
                <div className="absolute -bottom-16 -right-10 w-48 h-48 bg-[#C1121F]/30 blur-[60px] rounded-full" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <partner.icon className="w-8 h-8 text-[#ff7a85]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4">{partner.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{partner.desc}</p>
                </div>
              </div>
              <div className="lg:col-span-7 p-10 md:p-12">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Typical engagement focus</p>
                <div className="space-y-4">
                  {partner.focus.map((f) => (
                    <div key={f} className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-bold text-slate-800">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] text-white text-sm font-bold transition-colors">
                  Discuss a partnership <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHO_WE_SERVE.map((w, i) => (
              <button
                key={w.name}
                type="button"
                onClick={() => setActivePartner(i)}
                className={`text-left rounded-3xl border bg-white p-7 shadow-sm transition-all ${
                  activePartner === i
                    ? "border-[#C1121F] shadow-lg ring-2 ring-[#C1121F]/10 -translate-y-1"
                    : "border-slate-100 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center mb-4">
                  <w.icon className="w-6 h-6" />
                </div>
                <h4 className="font-black text-[#020617] mb-2 text-sm">{w.name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{w.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERINGS ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Capability Suite</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">What institutional partners get</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFERINGS.map((o) => (
              <div key={o.title} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-8 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#C1121F] text-white flex items-center justify-center mb-5">
                  <o.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#020617] mb-2 tracking-tight">{o.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>

          {scope.length > 0 && (
            <div className="mt-12 max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
              {scope.map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                  <p className="text-sm font-semibold text-slate-700 pt-1">{s}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DELIVERY APPROACH (interactive) ──────────────────── */}
      <section className="py-20 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C1121F]/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#ff7a85] font-black uppercase tracking-[0.4em] text-[10px]">Our Delivery Approach</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">A proven, end-to-end methodology</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {APPROACH.map((s, i) => (
              <button
                key={s.title}
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
              <step.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7a85] mb-2">Phase {String(activeStep + 1).padStart(2, "0")}</p>
              <h3 className="text-2xl font-black text-white mb-3">{step.title}</h3>
              <p className="text-slate-300 leading-relaxed max-w-3xl">{step.desc}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {APPROACH.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`text-left rounded-3xl border p-6 transition-all ${
                  activeStep === i ? "bg-white/10 border-[#C1121F]/50" : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-3xl font-black text-white/15">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="text-white font-bold text-sm mt-2 mb-2">{s.title}</h4>
                <p className="text-slate-400 text-[12px] leading-relaxed line-clamp-3">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENT MODELS ────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Engagement Models</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Start small. Scale with evidence.</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {ENGAGEMENT.map((model, i) => (
              <button
                key={model.title}
                type="button"
                onClick={() => setActiveEngagement(i)}
                className={`text-left rounded-[2rem] border p-8 transition-all ${
                  activeEngagement === i
                    ? "border-[#C1121F] bg-[#C1121F]/[0.03] shadow-xl ring-2 ring-[#C1121F]/10"
                    : "border-slate-200 bg-white hover:shadow-lg"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C1121F] mb-2">{model.subtitle}</p>
                <h3 className="text-xl font-black text-[#020617] mb-5">{model.title}</h3>
                <ul className="space-y-3">
                  {model.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── KPIs + IMPACT ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50/70">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Monitoring Framework</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight mt-3 mb-4">KPIs we typically track</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Every partnership defines success metrics before launch — so reporting is clear for ministries, donors, and boards.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                  <p className="font-black text-[#020617] text-sm">{k.label}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{k.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Outcomes</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight mt-3 mb-8">Impact that lasts</h2>
            <div className="space-y-4">
              {(impact.length ? impact : [
                "Strengthens education systems",
                "Builds workforce readiness",
                "Drives long-term socio-economic impact",
              ]).map((item, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C1121F] text-white flex items-center justify-center">
                    <ChartIcon className="w-5 h-5" />
                  </span>
                  <p className="text-slate-700 font-semibold leading-snug pt-1.5">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SDGs ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">Global Alignment</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Aligned to the UN SDGs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SDGS.map((sdg) => (
              <div key={sdg.code} className="rounded-3xl border border-slate-100 p-7 hover:border-[#C1121F]/30 hover:shadow-lg transition-all group">
                <p className="text-4xl font-black text-[#C1121F]/20 group-hover:text-[#C1121F]/40 transition-colors">SDG</p>
                <p className="text-3xl font-black text-[#C1121F] -mt-2 mb-3">{sdg.code}</p>
                <h3 className="font-black text-[#020617] mb-2">{sdg.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{sdg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#C1121F] font-black uppercase tracking-[0.4em] text-[10px]">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#020617] tracking-tight">Common partnership questions</h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border-b border-slate-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex-1 text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronIcon className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
