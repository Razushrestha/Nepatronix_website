import type { Testimonial } from "../data";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {testimonials.map((testimonial) => (
        <figure
          key={testimonial.id}
          className="rounded-2xl border border-[#e3f2fd] surface-card p-6 shadow-sm"
        >
          <blockquote className="text-base font-medium text-[#1f2933]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm text-subtle">
            {testimonial.name} · {testimonial.role}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
