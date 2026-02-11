import { defineType, defineField } from 'sanity';

export const coursePdf = defineType({
  name: 'coursePdf',
  title: 'Course PDFs',
  type: 'document',
  fields: [
    defineField({
      name: 'courseId',
      title: 'Course ID',
      type: 'number',
      description: 'Enter the course ID number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'PDF Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'PDF Description',
      type: 'text',
      description: 'Brief description of what this PDF contains',
    }),
    defineField({
      name: 'pdfFile',
      title: 'Course PDF File',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      description: 'Upload the course PDF (syllabus, curriculum, overview)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'PDF Thumbnail/Cover',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional cover image for the PDF',
    }),
    defineField({
      name: 'pageCount',
      title: 'Page Count',
      type: 'number',
      description: 'Number of pages in the PDF (optional)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which PDFs appear (lower number first)',
      initialValue: 0,
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      courseId: 'courseId',
      media: 'thumbnail',
    },
    prepare({ title, courseId, media }) {
      const courseNames: Record<number, string> = {
        1: "Short Course",
        2: "Tutor Training",
        3: "Professional Cert",
        4: "Science Lab",
        5: "Math STEM",
      };
      return {
        title: title || 'Untitled PDF',
        subtitle: `Course ${courseId}: ${courseNames[courseId] || 'Unknown'}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: 'Course Order',
      name: 'courseOrder',
      by: [
        { field: 'courseId', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
});
