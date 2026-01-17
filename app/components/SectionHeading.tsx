type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0a3d62]">
        {eyebrow}
      </span>
      <h2 className="text-2xl font-semibold text-[#1f2933] sm:text-3xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm text-subtle sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
