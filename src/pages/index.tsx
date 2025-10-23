import type { GetStaticProps } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

import Card from '~/components/Card'
import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[]
    tags: string[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const posts = await getPosts(client)

  const tagSet = new Set<string>()
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagSet.add(tag))
  })
  const tags = Array.from(tagSet)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      posts,
      tags,
    },
  }
}

export default function IndexPage({
  posts: initialPosts,
}: {
  posts: Post[]
}) {
  const router = useRouter()
  const [posts] = useLiveQuery<Post[]>(initialPosts, postsQuery)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])))

  useEffect(() => {
    const urlTags = router.query.tags
    if (typeof urlTags === 'string') {
      const tagsFromUrl = urlTags.split(',').filter(Boolean)
      setActiveTags(tagsFromUrl)
    }

    // Handle selected post from URL
    const postId = router.query.post
    if (typeof postId === 'string') {
      const post = posts.find((p) => p._id === postId)
      if (post) setSelectedPost(post)
    }
  }, [router.query.tags, router.query.post, posts])

  const toggleHeader = () => {
    setIsHeaderExpanded(!isHeaderExpanded)
  }

  const updateUrlTags = (tags: string[]) => {
    const query = { ...router.query }
    if (tags.length > 0) {
      query.tags = tags.join(',')
    } else {
      delete query.tags
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    )
  }

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
      updateUrlTags(next)
      return next
    })
  }

  const selectPost = (post: Post) => {
    // Toggle: if clicking on already selected post, deselect it
    if (selectedPost && selectedPost._id === post._id) {
      closeDetail()
      return
    }

    setSelectedPost(post)
    const query = { ...router.query, post: post._id }
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    )
  }

  const closeDetail = () => {
    setSelectedPost(null)
    const query = { ...router.query }
    delete query.post
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    )
  }

  const filteredPosts =
    activeTags.length === 0
      ? posts
      : posts.filter((post) =>
          post.tags?.some((tag) => activeTags.includes(tag))
        )

  const sortedPosts = filteredPosts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reverse()

  return (
    <Container>
      <div className="header__container">
        <header className={`header ${!isHeaderExpanded ? 'header-collapsed' : ''}`}>

          <AnimatePresence mode="popLayout">
            <div className="posts__container">
              {sortedPosts.length ? (
                sortedPosts
                  .slice()
                  .reverse()
                  .map((post) => {
                    const isSelected = selectedPost && selectedPost._id === post._id
                    const hasSelection = selectedPost !== null
                    const opacity = hasSelection ? (isSelected ? 1 : 0.2) : 1

                    return (
                      <motion.div
                        key={post._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: opacity, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => selectPost(post)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card post={post} expandAll={false} />
                      </motion.div>
                    )
                  })
              ) : (
                <motion.div
                  key="no-posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  No posts match the selected tags.
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </header>
      <div id="mainDiv">
        <section style={{ marginTop: '10px' }}>
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeInOut",
                  opacity: { duration: 0.3 }
                }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0px 0' }}>
                  {selectedPost && selectedPost.body ? (
                    <div className="header__body-content">
                      <h3 style={{ marginTop: '0px' }}>{selectedPost.title}</h3>
                      <p className="detail-view__date">
                        {new Date(selectedPost.date).toLocaleDateString()}
                      </p>
                      <div className="detail-view__tags">
                        {selectedPost.tags && selectedPost.tags.map((tag) => (
                          <span key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <PortableText value={selectedPost.body} />
                    </div>
                  ) : (
                    <p>Brussels, Belgium<br />breynaertsimon@gmail.com</p>
                  )}
                </div>
              </motion.div>
          </AnimatePresence>
        </section>

        <AnimatePresence>
          {selectedPost && (
            <motion.section
              className="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="detail-view__content">

                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: "easeInOut",
                      opacity: { duration: 0.3 }
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: '10px' }}>
                      {selectedPost.mainImage && (
                        <div className="image-container">
                          <Image
                            src={urlForImage(selectedPost.mainImage).url()}
                            alt={selectedPost.title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                              width: '100%',  
                              height: 'auto',
                            }}
                          />
                        </div>
                      )}
                      
                      {selectedPost.gallery && selectedPost.gallery.length > 0 && (
                        <div className="gallery">
                          {selectedPost.gallery.map((image, i) => (
                            <Image
                              key={image._key || i}
                              src={urlForImage(image).url()}
                              alt={image.alt || `Gallery image ${i + 1}`}
                              width={600}
                              height={400}
                              style={{ width: '100%', height: 'auto', marginBottom: '1rem' }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      </div>
    </Container>
  )
}