import type { Course } from "../data";

export function CourseShowcase({ courses }: { courses: Course[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {courses.map((course) => (
        <article
          key={course.id}
          className="flex h-full flex-col justify-between rounded-2xl border border-[#e3f2fd] surface-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a3d62]">
              {course.category}
            </span>
            <h3 className="text-xl font-semibold text-[#1f2933]">{course.title}</h3>
            <ul className="space-y-2 text-sm text-subtle">
              {course.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-[#e63946]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#e3f2fd] pt-4 text-sm text-subtle">
            <span className="font-medium">{course.level}</span>
            <span>{course.duration}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
