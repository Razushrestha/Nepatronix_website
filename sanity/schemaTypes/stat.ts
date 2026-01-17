import { defineField, defineType } from 'sanity'

export const stat = defineType({
  name: 'stat',
  title: 'Statistic',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'detail',
      title: 'Detail',
      type: 'string',
    }),
  ],
})
