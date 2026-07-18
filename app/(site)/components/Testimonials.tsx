import type { Testimonial } from "../data";

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <figure
          key={testimonial.id}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <Stars rating={testimonial.rating ?? 5} />
          <blockquote className="text-sm leading-relaxed text-slate-600">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 border-t border-slate-100 pt-4">
            <p className="font-semibold text-slate-900">{testimonial.name}</p>
            <p className="text-sm text-slate-500">{testimonial.role}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
