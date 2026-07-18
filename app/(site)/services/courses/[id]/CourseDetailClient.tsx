"use client";

import { useState } from "react";
import type { CourseOverview } from "@/lib/course-overview";
import CourseDetailExplorer, { CourseHero } from "../CourseDetailExplorer";
import EnrollModal from "../EnrollModal";

export default function CourseDetailClient({
  course,
  initialEnrollOpen = false,
}: {
  course: CourseOverview;
  initialEnrollOpen?: boolean;
}) {
  const [enrollOpen, setEnrollOpen] = useState(initialEnrollOpen);
  const openEnroll = () => setEnrollOpen(true);

  return (
    <>
      <CourseHero course={course} onEnroll={openEnroll} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <CourseDetailExplorer course={course} onEnroll={openEnroll} />
      </div>
      {enrollOpen && (
        <EnrollModal
          course={{ name: course.name, price: course.price, priceUnit: course.priceUnit }}
          onClose={() => setEnrollOpen(false)}
        />
      )}
    </>
  );
}
