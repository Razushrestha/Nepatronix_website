import { defineType, defineField } from 'sanity'

export const certificationApplication = defineType({
  name: 'certificationApplication',
  title: 'Certification Applications',
  type: 'document',
  fields: [
    defineField({
      name: 'applicantName',
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
      name: 'profileImage',
      title: 'Profile Photo',
      type: 'image',
      description: 'Circular image for certificate (left side)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'courseType',
      title: 'Course Type',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Free', value: 'free' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trainingHours',
      title: 'Training Hours',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trainingDays',
      title: 'Training Days',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'courseName',
      title: 'Course Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Application Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Payment', value: 'pending' },
          { title: 'Payment Verified', value: 'payment_verified' },
          { title: 'Approved', value: 'approved' },
          { title: 'Certificate Generated', value: 'certificate_generated' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'paymentDetails',
      title: 'Payment Information',
      type: 'object',
      fields: [
        { name: 'amount', type: 'number', title: 'Amount (NPR)' },
        { name: 'paymentMethod', type: 'string', title: 'Payment Method',
          options: { list: ['eSewa', 'Khalti', 'Bank Transfer', 'Cash'] }
        },
        { name: 'paymentDate', type: 'datetime', title: 'Payment Date' },
        { name: 'paymentProof', type: 'image', title: 'Payment Screenshot' },
      ],
    }),
    defineField({
      name: 'certificateDetails',
      title: 'Certificate Information',
      type: 'object',
      description: '🔒 Auto-generated when status changes to "Approved". Do not edit manually.',
      fields: [
        { 
          name: 'certificateUID', 
          type: 'string', 
          title: 'Certificate UID', 
          description: '🤖 Auto-generated: NT-YYYY-XXXXX format',
          readOnly: true,
          placeholder: 'Will be generated on approval'
        },
        { 
          name: 'issueDate', 
          type: 'date', 
          title: 'Issue Date',
          description: '🤖 Auto-generated on certificate creation',
          readOnly: true,
          placeholder: 'Will be set on approval'
        },
        { 
          name: 'certificateUrl', 
          type: 'url', 
          title: 'Certificate Verification URL',
          description: '🔗 Public verification link',
          readOnly: true,
          placeholder: 'Will be generated on approval'
        },
        { 
          name: 'qrCodeData', 
          type: 'text', 
          title: 'QR Code Data',
          description: '🤖 Auto-generated JSON with student & course details (name, email, phone, course, hours, days, issue date)',
          readOnly: true,
          placeholder: 'Will be populated automatically when certificate is generated',
          rows: 8
        },
      ],
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'applicantName',
      subtitle: 'email',
      status: 'status',
      media: 'profileImage',
    },
    prepare({ title, subtitle, status, media }) {
      const statusLabel = {
        pending: '[Pending]', 
        payment_verified: '[Verified]', 
        approved: '[Approved]',
        certificate_generated: '[Certificate Ready]', 
        rejected: '[Rejected]'
      }[status as string] || '[New]';
      
      return {
        title: `${statusLabel} ${title}`,
        subtitle: `${subtitle} • ${status}`,
        media,
      };
    },
  },
})
