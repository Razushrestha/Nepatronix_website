import { defineType, defineField } from 'sanity';

export const courseVideo = defineType({
  name: 'courseVideo',
  title: 'Course Videos',
  type: 'document',
  fields: [
    defineField({
      name: 'courseId',
      title: 'Course ID',
      type: 'number',
      description: 'Match this with the course ID (1-5)',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Video Description',
      type: 'text',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Upload the course video file (MP4 recommended)',
    }),
    defineField({
      name: 'videoUrl',
      title: 'External Video URL',
      type: 'url',
      description: 'Or provide an external video URL (YouTube, Vimeo embed URL)',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "1:30:00" or "45 minutes"',
    }),
    defineField({
      name: 'overviewPdf',
      title: 'Course Overview PDF',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      description: 'Upload a PDF for course overview/syllabus (view only, no download)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which videos appear (lower number first)',
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
      return {
        title: title,
        subtitle: `Course ${courseId}`,
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
