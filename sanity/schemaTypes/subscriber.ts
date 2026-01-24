export default {
    name: 'subscriber',
    title: 'Newsletter Subscribers',
    type: 'document',
    fields: [
      {
        name: 'email',
        title: 'Email Address',
        type: 'string',
        validation: (Rule: any) => Rule.required().email(),
      },
      {
        name: 'subscribedAt',
        title: 'Subscribed At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
          list: [
            { title: 'Active', value: 'active' },
            { title: 'Unsubscribed', value: 'unsubscribed' },
          ],
        },
        initialValue: 'active',
      },
    ],
  };
