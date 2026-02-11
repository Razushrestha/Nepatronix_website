import { defineType, defineField } from 'sanity'

export const certificate = defineType({
  name: 'certificate',
  title: 'Certificates',
  type: 'document',
  fields: [
    defineField({
      name: 'certificateNumber',
      title: 'Certificate UID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'application',
      title: 'Related Application',
      type: 'reference',
      to: [{ type: 'courseApplication' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recipientName',
      title: 'Recipient Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recipientImage',
      title: 'Profile Image',
      type: 'image',
    }),
    defineField({
      name: 'courseName',
      title: 'Course Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'courseHours',
      title: 'Course Hours',
      type: 'string',
    }),
    defineField({
      name: 'courseDays',
      title: 'Course Days',
      type: 'string',
    }),
    defineField({
      name: 'issueDate',
      title: 'Issue Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'certificateFile',
      title: 'Certificate PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'qrCodeData',
      title: 'QR Code Data',
      type: 'text',
    }),
    defineField({
      name: 'verificationUrl',
      title: 'Verification URL',
      type: 'url',
    }),
    defineField({
      name: 'organizationName',
      title: 'Organization',
      type: 'string',
      initialValue: 'Nepatronix',
    }),
    defineField({
      name: 'signatoryName',
      title: 'Signatory Name',
      type: 'string',
    }),
    defineField({
      name: 'signatoryTitle',
      title: 'Signatory Title',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'recipientName',
      subtitle: 'certificateNumber',
      media: 'recipientImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `📜 ${title}`,
        subtitle,
        media,
      };
    },
  },
})
