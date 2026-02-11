import { defineType, defineField } from 'sanity';

export const enrollment = defineType({
  name: 'enrollment',
  title: 'Course Enrollments',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'School/Organization',
      type: 'string',
    }),
    defineField({
      name: 'courseName',
      title: 'Course Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coursePrice',
      title: 'Course Price',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Additional Message',
      type: 'text',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Enrolled', value: 'enrolled' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Notes for internal use only',
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'courseName',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      const statusEmoji = {
        pending: '🟡',
        contacted: '🟢',
        enrolled: '✅',
        cancelled: '❌',
      }[status as string] || '⚪';
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: subtitle,
      };
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
});
