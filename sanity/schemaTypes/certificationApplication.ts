export const certificationApplication = {
  name: 'certificationApplication',
  title: 'Certification Application',
  type: 'document',
  fields: [
    {
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'courseType',
      title: 'Course Type',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Free', value: 'free' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'trainingHours',
      title: 'Training Hours',
      type: 'string',
      options: {
        list: [
          { title: '1.5 hours', value: '1.5' },
          { title: '3 hours', value: '3' },
          { title: '30 hours', value: '30' },
          { title: '35 hours', value: '35' },
          { title: '40 hours', value: '40' },
          { title: '60 hours', value: '60' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'trainingDays',
      title: 'Training Days',
      type: 'string',
      options: {
        list: [
          { title: '1 day', value: '1' },
          { title: '7 days', value: '7' },
          { title: '10 days', value: '10' },
          { title: '45 days', value: '45' },
          { title: '60 days', value: '60' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'studentImage',
      title: 'Student Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'contactNumber',
      title: 'Contact Number',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'paymentScreenshot',
      title: 'Payment Screenshot',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      media: 'studentImage',
    },
  },
};
