import type { Stat } from "../data";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-6 rounded-3xl border border-[#e3f2fd] surface-card p-8 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.id} className="flex flex-col gap-1 items-center text-center sm:items-start sm:text-left">
          <span className="text-3xl font-semibold text-[#1f2933]">{stat.value}</span>
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-[#0a3d62]">
            {stat.label}
          </span>
          <span className="text-sm text-[#6B7280]">{stat.detail}</span>
        </div>
      ))}
    </div>
  );
}
