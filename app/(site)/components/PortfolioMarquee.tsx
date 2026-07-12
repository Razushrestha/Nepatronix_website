import type { PortfolioItemContent } from '@/lib/site-content'

export function PortfolioMarquee({ items }: { items: PortfolioItemContent[] }) {
  const doubled = items.concat(items)

  return (
    <div className="mt-16 overflow-hidden">
      <div className="animate-marquee flex gap-6">
        {doubled.map((project, index) => (
          <div
            key={`${project.name}-${index}`}
            className="flex w-72 flex-shrink-0 flex-col items-center rounded-xl border border-[#e3f2fd] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="mb-4 text-4xl">🌐</div>
            <h3 className="mb-3 text-center text-lg font-semibold text-[#1f2933]">{project.name}</h3>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1565c0]"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
