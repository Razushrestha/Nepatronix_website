import { defineField, defineType } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      initialValue: "Contact us",
    }),
    defineField({
      name: "pageDescription",
      title: "Page Description",
      type: "text",
    }),
    defineField({
      name: "contactDetails",
      title: "Contact Details",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email Address", type: "string" }),
        defineField({ name: "phone", title: "Phone Number", type: "string" }),
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "hours", title: "Working Hours", type: "string" }),
      ],
    }),
    defineField({
      name: "formTitle",
      title: "Form Section Title",
      type: "string",
      initialValue: "Send a message",
    }),
    defineField({
      name: "formSubtitle",
      title: "Form Section Subtitle",
      type: "string",
      initialValue: "We reply within one business day.",
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media Links",
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
  ],
});
