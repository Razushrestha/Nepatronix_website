import { defineType, defineField } from 'sanity'

export const courseApplication = defineType({
  name: 'courseApplication',
  title: 'Course Applications',
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
          { title: '⏳ Pending Payment', value: 'pending' },
          { title: '✅ Payment Verified', value: 'payment_verified' },
          { title: '🎓 Approved', value: 'approved' },
          { title: '📜 Certificate Generated', value: 'certificate_generated' },
          { title: '❌ Rejected', value: 'rejected' },
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
        { name: 'transactionId', type: 'string', title: 'Transaction ID' },
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
      fields: [
        { name: 'certificateUID', type: 'string', title: 'Certificate UID', readOnly: true },
        { name: 'issueDate', type: 'date', title: 'Issue Date' },
        { name: 'certificateUrl', type: 'url', title: 'Certificate PDF URL' },
        { name: 'qrCodeData', type: 'text', title: 'QR Code Data' },
      ],
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
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
      const statusEmoji = {
        pending: '⏳', 
        payment_verified: '✅', 
        approved: '🎓',
        certificate_generated: '📜', 
        rejected: '❌'
      }[status as string] || '📝';
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${subtitle} • ${status}`,
        media,
      };
    },
  },
})
