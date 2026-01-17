import { defineField, defineType } from 'sanity'

export const feature = defineType({
  name: 'feature',
  title: 'Feature',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icon (SVG String or Image)',
      type: 'string', // Often SVGs are passed as strings or you upload 
      // but here sticking to image is safer if they want to upload icons
      // However data.ts has `icon: string`. Let's assume it's an image for sanity flexibility or string input for icon name.
      // I'll make it an image for now, as Sanity users usually prefer uploading.
    }),
    defineField({
        name: 'iconImage', // Alternative if they want to upload
        title: 'Icon Image',
        type: 'image',
    })
  ],
})
