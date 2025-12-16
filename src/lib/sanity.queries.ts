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
  videoLoop,
  videos,
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
  videoLoop,
  videos,
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
  videos?: { url: string; title?: string }[]
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

export const bioQuery = groq`*[_type == "bio"][0] {
  bioText,
  profilePhoto,
  email,
  phone,
  socials,
  selectedClients
}`

export interface Bio {
  bioText: string
  profilePhoto?: ImageAsset
  email: string
  phone?: string
  socials?: {
    platform: 'instagram' | 'linkedin' | 'twitter' | 'vimeo' | 'behance' | 'website'
    url: string
    handle?: string
  }[]
  selectedClients?: {
    name: string
    url?: string
  }[]
}

export async function getBio(client: SanityClient): Promise<Bio | null> {
  return await client.fetch(bioQuery)
}