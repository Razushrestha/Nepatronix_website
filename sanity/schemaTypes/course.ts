import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "4 weeks", "2 months"',
    }),
    defineField({
      name: 'hours',
      title: 'Total Hours',
      type: 'number',
      description: 'Total course hours (e.g., 40, 200)',
    }),
    defineField({
      name: 'deliveryMode',
      title: 'Delivery Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Online', value: 'Online' },
          { title: 'In-Person', value: 'In-Person' },
          { title: 'Blended', value: 'Blended' },
        ],
      },
    }),
    defineField({
      name: 'examMode',
      title: 'Exam Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Online', value: 'Online' },
          { title: 'In-Person', value: 'In-Person' },
          { title: 'Blended', value: 'Blended' },
        ],
      },
    }),
    defineField({
      name: 'priceUnit',
      title: 'Price Unit',
      type: 'string',
      description: 'e.g., "per person", "per group"',
      initialValue: 'per person',
    }),
    defineField({
      name: 'popular',
      title: 'Mark as Popular',
      type: 'boolean',
      description: 'Display "Popular" badge on this course',
      initialValue: false,
    }),
    defineField({
      name: 'isFree',
      title: 'Free Course',
      type: 'boolean',
      description: 'Mark this course as free (no payment required)',
      initialValue: false,
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    // Course PDF Section
    defineField({
      name: 'coursePdf',
      title: 'Course PDF',
      type: 'object',
      description: 'Upload course syllabus, curriculum, or overview PDF',
      fields: [
        defineField({
          name: 'pdfFile',
          title: 'PDF File',
          type: 'file',
          options: {
            accept: 'application/pdf',
          },
          description: 'Upload the course PDF (syllabus, curriculum, overview)',
        }),
        defineField({
          name: 'pdfTitle',
          title: 'PDF Title',
          type: 'string',
          description: 'Optional title for the PDF (defaults to course title if empty)',
        }),
      ],
    }),
    // ========== UPCOMING SESSION FIELDS ==========
    defineField({
      name: 'isUpcoming',
      title: 'Upcoming Session',
      type: 'boolean',
      description: 'Mark this course as an upcoming session to display on the Upcoming Sessions page',
      initialValue: false,
    }),
    defineField({
      name: 'sessionStatus',
      title: 'Session Status',
      type: 'string',
      description: 'Current status of the session (automatically determined by dates, but can be manually overridden)',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      initialValue: 'upcoming',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'sessionStartDate',
      title: 'Session Start Date & Time',
      type: 'datetime',
      description: 'When does this session start?',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'sessionEndDate',
      title: 'Session End Date',
      type: 'datetime',
      description: 'When does this session end? (Optional)',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'enrollmentDeadline',
      title: 'Enrollment Deadline',
      type: 'datetime',
      description: 'Last date to enroll for this session',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'maxSeats',
      title: 'Maximum Seats',
      type: 'number',
      description: 'Maximum number of participants (leave empty for unlimited)',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'currentEnrollments',
      title: 'Current Enrollments',
      type: 'number',
      description: 'Number of students currently enrolled',
      initialValue: 0,
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'sessionVenue',
      title: 'Session Venue',
      type: 'string',
      description: 'Location for offline/hybrid sessions (e.g., "Kathmandu Office", "Online via Zoom")',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'batchName',
      title: 'Batch Name',
      type: 'string',
      description: 'e.g., "Batch 1", "January 2026 Cohort"',
      hidden: ({ document }) => !document?.isUpcoming,
    }),
    defineField({
      name: 'meetingUrl',
      title: 'Meeting URL',
      type: 'url',
      description: 'Google Meet, Zoom, or other meeting link for online/blended sessions',
      hidden: ({ document }) => !document?.isUpcoming || (document?.deliveryMode !== 'Online' && document?.deliveryMode !== 'Blended'),
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      description: 'External registration form URL (e.g. Google Forms, Typeform). When set, the "Enroll Now" button will redirect here instead of showing the built-in form.',
      hidden: ({ document }) => !document?.isUpcoming,
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isUpcoming: 'isUpcoming',
      isFree: 'isFree',
      sessionStartDate: 'sessionStartDate',
      sessionStatus: 'sessionStatus',
    },
    prepare({ title, isUpcoming, isFree, sessionStartDate, sessionStatus }) {
      const badges = [];
      if (isUpcoming) {
        if (sessionStatus === 'completed') {
          badges.push('✅ Completed');
        } else if (sessionStatus === 'ongoing') {
          badges.push('🔴 Ongoing');
        } else {
          badges.push('📅 Upcoming');
        }
      }
      if (isFree) badges.push('🆓 Free');
      
      const subtitle = badges.length > 0 
        ? `${badges.join(' | ')}${sessionStartDate ? ` - ${new Date(sessionStartDate).toLocaleDateString()}` : ''}`
        : '';
      
      return {
        title,
        subtitle,
      };
    },
  },
})
