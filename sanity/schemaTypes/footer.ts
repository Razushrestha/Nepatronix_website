import { defineField, defineType } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer Section",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      initialValue: "Nepatronix",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Innovation in Education",
    }),
    defineField({
      name: "description",
      title: "Company Description",
      type: "text",
      description: "Short description appearing in the footer",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information (This One)",
      type: "object",
      fields: [
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "weekdayHours", title: "Weekday Hours", type: "string" }),
        defineField({ name: "weekendHours", title: "Weekend Hours", type: "string" }),
      ],
    }),
    defineField({
      name: "quickLinks",
      title: "Quick Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Link Name", type: "string" },
            { name: "href", title: "URL Path", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "expertise",
      title: "Our Expertise / Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Service Name", type: "string" },
            { name: "desc", title: "Short Description", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Stay Connected (Social Links)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", title: "Platform Name", type: "string" },
            { name: "url", title: "Profile URL", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
    }),
  ],
});
