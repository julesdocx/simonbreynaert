// schemas/bio.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'bio',
  title: 'Bio & Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'bioText',
      title: 'Bio Text',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Twitter / X', value: 'twitter' },
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'Behance', value: 'behance' },
                  { title: 'Website', value: 'website' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'handle',
              title: 'Handle / Display Name',
              type: 'string',
              description: 'e.g., @smn_brynrt',
            },
          ],
          preview: {
            select: { platform: 'platform', handle: 'handle' },
            prepare({ platform, handle }) {
              return {
                title: platform,
                subtitle: handle,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'selectedClients',
      title: 'Selected Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'client',
          title: 'Client',
          fields: [
            {
              name: 'name',
              title: 'Client Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Website URL',
              type: 'url',
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Bio & Contact',
      }
    },
  },
})