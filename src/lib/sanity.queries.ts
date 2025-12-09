import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc) {
  _id,
  _createdAt,
  title,
  subtitle,
  slug,
  date,
  mainImage,
  gallery,
  body,
  "tags": tags[]->name,
  videoLoop
}`

export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery)
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  subtitle,
  slug,
  date,
  mainImage,
  gallery,
  body,
  "tags": tags[]->name,
  videoLoop
}`

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
  })
}

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

export interface Post {
  _type: 'post'
  _id: string
  _createdAt: string
  title?: string
  subtitle?: string
  slug: Slug
  date: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
  tags?: string[]
  videoLoop?: string
  gallery?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    _key?: string
    _type: 'image'
    alt?: string
  }[]
}