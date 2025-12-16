import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'subtitle',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date', // ✅ built-in date type
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true }, // optional: enables focal point editing
        },
      ],
    }),
defineField({
  name: 'videos',
  title: 'Videos',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'vimeoVideo',
      title: 'Vimeo Video',
      fields: [
        {
          name: 'url',
          title: 'Vimeo URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'title',
          title: 'Title (optional)',
          type: 'string',
        },
      ],
      preview: {
        select: { title: 'title', url: 'url' },
        prepare({ title, url }) {
          return {
            title: title || url,
            subtitle: 'Vimeo Video',
          }
        },
      },
    },
  ],
}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'videoLoop',
      title: 'Video Loop (for homepage)',
      type: 'string',
      description: 'Filename of the video in /public/videos/ (e.g., "project-1.mp4")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
