import type { Stat } from "../data";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:divide-y-0 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="group flex flex-col items-center justify-center gap-1 px-4 py-5 text-center transition-colors hover:bg-slate-50"
          >
            <span className="text-2xl font-bold tracking-tight text-[#0a3d62] transition-colors group-hover:text-[#C1121F] sm:text-[1.75rem]">
              {stat.value}
            </span>
            <span className="mt-0.5 h-0.5 w-6 rounded-full bg-[#C1121F]/60 transition-all group-hover:w-10" />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {stat.label}
            </span>
            <span className="text-[11px] leading-snug text-slate-400">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
