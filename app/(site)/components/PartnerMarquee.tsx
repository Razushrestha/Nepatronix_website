export function PartnerMarquee({ logos }: { logos: string[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e3f2fd] surface-card py-6">
      <div className="flex animate-marquee items-center gap-12 px-6">
        {logos.concat(logos).map((logo, index) => (
          <img
            src={logo}
            alt="Partner logo"
            key={`${logo}-${index}`}
            className="h-6 opacity-70 grayscale transition hover:opacity-100"
          />
        ))}
      </div>
    </div>
  );
}
