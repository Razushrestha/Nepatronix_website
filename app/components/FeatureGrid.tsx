import type { Feature } from "../data";

type FeatureGridProps = {
  items: Feature[];
};

export function FeatureGrid({ items }: FeatureGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((feature) => (
        <article
          key={feature.id}
          className="flex flex-col gap-3 rounded-2xl border border-[#e3f2fd] surface-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <span className="inline-flex w-fit rounded-full bg-[#e3f2fd] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0a3d62]">
            {feature.icon}
          </span>
          <h3 className="text-lg font-semibold text-[#1f2933]">{feature.title}</h3>
          <p className="text-sm text-subtle">{feature.description}</p>
        </article>
      ))}
    </div>
  );
}
