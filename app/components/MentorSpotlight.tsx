import Image from "next/image";
import type { Mentor } from "../data";

export function MentorSpotlight({ mentors }: { mentors: Mentor[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <article
          key={mentor.id}
          className="rounded-2xl border border-[#e3f2fd] surface-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[#e3f2fd]">
              <Image
                src={mentor.avatar}
                alt={mentor.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1f2933]">{mentor.name}</h3>
              <p className="text-sm text-subtle">
                {mentor.role} at {mentor.company}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-subtle">{mentor.bio}</p>
        </article>
      ))}
    </div>
  );
}
