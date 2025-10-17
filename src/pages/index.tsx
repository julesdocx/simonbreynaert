import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'motion/react'

import Card from '~/components/Card'
import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
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
  const [expandAll, setExpandAll] = useState(false)

  // ✅ All tags (as strings)
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])))

  const toggleExpandAll = () => {
    setExpandAll((prev) => !prev)
  }

  useEffect(() => {
    const urlTags = router.query.tags
    if (typeof urlTags === 'string') {
      const tagsFromUrl = urlTags.split(',').filter(Boolean)
      setActiveTags(tagsFromUrl)
    }
  }, [router.query.tags])

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

  const filteredPosts =
    activeTags.length === 0
      ? posts
      : posts.filter((post) =>
          post.tags?.some((tag) => activeTags.includes(tag))
        )

  const sortedPosts = filteredPosts
  .slice() // clone to avoid mutating original
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).reverse()

  return (
    <Container>
      <div id="mainDiv">
        <section>
          <AnimatePresence mode="popLayout">
            <div className="posts__container">
              {sortedPosts.length ? (
                sortedPosts
                  .slice()
                  .reverse()
                  .map((post) => (
                    <motion.div
                      key={post._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card post={post} expandAll={expandAll} />
                    </motion.div>
                  ))
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
        </section>

        <section>
          <AnimatePresence>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                cursor: 'pointer',
              }}
            >
              {/* === Tag Toggles === */}
              <div
                className="tags_container"
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginTop: '12px',
                  fontFamily: 'Arial, sans-serif',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {allTags.map((tag) => {
                  const isActive = activeTags.includes(tag)
                  return (
                    <div
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      
                      <span style={{ color: isActive ? 'black' : 'grey' }}>
                        {tag}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </AnimatePresence>
        </section>
      </div>
    </Container>
  )
}
