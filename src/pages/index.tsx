import type { GetStaticProps } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

import Card from '~/components/Card'
import Header from '~/components/Header'
import FilterTags from '~/components/FilterTags'
import Footer from '~/components/Footer'
import PostDetail from '~/components/PostDetail'
import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, getBio, type Post, type Bio, postsQuery } from '~/lib/sanity.queries'  // Add getBio and Bio
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

export const getStaticProps: GetStaticProps<SharedPageProps & { posts: Post[]; tags: string[]; bio: Bio | null }> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const posts = await getPosts(client)
  const bio = await getBio(client)

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
      bio,
    },
  }
}

export default function IndexPage({
  posts: initialPosts,
  bio,  // Add bio here
}: {
  posts: Post[]
  bio: Bio | null  // Add type here
}) {
  const router = useRouter()
  const [posts] = useLiveQuery<Post[]>(initialPosts, postsQuery)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  const hasSelection = selectedPost !== null && !isMobile

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Left panel - cards list */}
        <div  
          className={`
            transition-all duration-300 h-full flex flex-col
            ${hasSelection ? 'w-64 flex-shrink-0' : 'w-full'}
          `}
        > 
          {/* Filter tags header - fixed */}
          <div className={`
            px-2 md:px-6 lg:px-8 pt-3 flex-shrink-0 
            ${hasSelection ? '' : 'max-w-7xl md:mx-auto w-full'}
            
          `}>
            <Header 
              collapsed={hasSelection}
              allTags={allTags}
              activeTags={activeTags}
              onToggleTag={toggleTag}
              onBack={closeDrawer}
              bio={bio}
            />
          </div>

          {/* Scrollable cards area */}
          <div 
            className="flex-1 overflow-y-auto scrollbar-hide px-2 md:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            
            <div className={`
                pb-4
              ${hasSelection ? 'pl-4' : ' md:px-6 lg:px-8 max-w-7xl md:mx-auto'}
            `}>
              <div 
                className={`
                  grid  w-full transition-all duration-300 mt-4
                  ${hasSelection 
                    ? 'grid-cols-1 p0-2 gap-2' 
                    : 'grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
                  }
                `}
              >
                {sortedPosts.length ? (
                  sortedPosts
                    .slice()
                    .reverse()
                    .map((post) => {
                      const isSelected = selectedPost && selectedPost._id === post._id
                      const isHovered = hoveredPostId === post._id
                      const hasHover = hoveredPostId !== null
                      
                      let opacity = 1
                      return (
                        <motion.div
                          key={post._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: opacity, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          onClick={() => selectPost(post)}
                          onMouseEnter={() => !isMobile && setHoveredPostId(post._id)}
                          onMouseLeave={() => !isMobile && setHoveredPostId(null)}
                          style={{ cursor: 'pointer' }}
                          className='break-inside-avoid'
                        >
                          <Card 
                            post={post} 
                            onClick={() => selectPost(post)}
                            isSelected={isSelected}
                            hasSelection={hasSelection}
                            activeTags={activeTags}
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
            <div className='mx-auto w-full max-w-7xl px-2 md:px-6 lg:px-8'>
              {!hasSelection && <Footer />}
            </div>
          </div>
        </div>

        {/* Right panel - post detail */}
        {!isMobile && isDrawerOpen && selectedPost && (
          <motion.div 
            className="flex-1 h-full overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-4">
              <PostDetail 
                post={selectedPost}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                allImages={getAllImages(selectedPost)}
                onClose={closeDrawer}
              />
            </div>
          </motion.div>
        )}

        {/* Mobile drawer */}
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
    </div>
  )
}