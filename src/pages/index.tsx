import type { GetStaticProps } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

import Card from '~/components/Card'
import FilterTags from '~/components/FilterTags'
import PostDetail from '~/components/PostDetail'
import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import type { SharedPageProps } from '~/pages/_app'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'

export const getStaticProps: GetStaticProps<SharedPageProps & { posts: Post[]; tags: string[] }> = async ({ draftMode = false }) => {
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 750)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      if (post) {
        setSelectedPost(post)
        setIsDrawerOpen(true)
      }
    } else {
      setIsDrawerOpen(false)
    }
  }, [router.query.tags, router.query.post, posts])

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

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])))

  const selectPost = (post: Post) => {
    // Toggle: if clicking on already selected post, deselect it
    if (selectedPost && selectedPost._id === post._id) {
      closeDrawer()
      return
    }

    setSelectedPost(post)
    setSelectedImageIndex(0)
    setIsDrawerOpen(true)
    
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

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedPost(null)
    setSelectedImageIndex(0)
    
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

  // Create combined array of all images (mainImage + gallery)
  const getAllImages = (post: Post) => {
    const images = []
    
    if (post.mainImage && post.mainImage.asset) {
      images.push({ image: post.mainImage, isMain: true })
    }
    
    if (post.gallery && post.gallery.length > 0) {
      post.gallery
        .filter((image) => image && image.asset)
        .forEach((image) => {
          images.push({ image, isMain: false })
        })
    }

    return images
  }

  return (
    <Container>
      <div className="flex justify-center md:justify-between">
        {/* Main content area */}
        <div className={`grid transition-all duration-300 ${selectedPost && !isMobile ? '' : ''}`}>
          <div className="header__container">
            <div className="header">
                <div className="posts__container w-full md:w-auto">
                  {sortedPosts.length ? (
                    sortedPosts
                      .slice()
                      .reverse()
                      .map((post) => {
                        const isSelected = selectedPost && selectedPost._id === post._id
                        const isHovered = hoveredPostId === post._id
                        const hasSelection = selectedPost !== null
                        const hasHover = hoveredPostId !== null
                        
                        let opacity = 1
                        if (hasSelection) {
                          // If this card is selected, full opacity
                          // If another card is selected, low opacity
                          // If hovering over this card (even when another is selected), show it
                          if (isSelected) {
                            opacity = 1
                          } else if (isHovered) {
                            opacity = 0.7 // Show on hover even when something else is selected
                          } else {
                            opacity = 0.5
                          }
                        } else if (hasHover && !isMobile) {
                          opacity = isHovered ? 1 : 0.5
                        }
                        return (
                          <motion.div
                            key={post._id}
                            
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: opacity, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={() => selectPost(post)}
                            onMouseEnter={() => !isMobile && setHoveredPostId(post._id)}
                            onMouseLeave={() => !isMobile && setHoveredPostId(null)}
                            style={{ cursor: 'pointer', width:  ''}}
                          >
                            <Card 
                              post={post} 
                              onClick={() => selectPost(post)}
                              isSelected={isSelected}
                              hasSelection={selectedPost !== null}
                              activeTags={activeTags} // ADD THIS
                            />
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
            </div>

          </div>
        </div>
        {!isMobile && isDrawerOpen && (
          <AnimatePresence>
            {selectedPost && (
              <div className='pr-4 pt-4'>
                <PostDetail 
                  post={selectedPost}
                  selectedImageIndex={selectedImageIndex}
                  onImageSelect={setSelectedImageIndex}
                  allImages={getAllImages(selectedPost)}
                  onClose={closeDrawer}
                />
              </div>
            )}
          </AnimatePresence>
        )}
         {!isDrawerOpen && (
          <div className='mr-6 flex flex-col items-end'>
            <FilterTags 
              allTags={allTags}
              activeTags={activeTags}
              onToggleTag={toggleTag}
            />
          </div>
        )}   

        {isMobile && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} onClose={closeDrawer}>
            <DrawerContent className="max-h-[96vh]">
              <div className="mx-auto w-full max-w-4xl">
                <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: 'calc(96vh - 140px)' }}>
                  {selectedPost && (
                    <PostDetail 
                      post={selectedPost}
                      selectedImageIndex={selectedImageIndex}
                      onImageSelect={setSelectedImageIndex}
                      allImages={getAllImages(selectedPost)}
                      onClose={closeDrawer}
                    />
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </Container>
  )
}