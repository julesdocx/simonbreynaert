// ~/components/PostDetail.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel'
import { urlForImage } from '~/lib/sanity.image'
import type { Post } from '~/lib/sanity.queries'
import { Badge } from '~/components/ui/badge'

interface PostDetailProps {
  post: Post
  selectedImageIndex: number
  onImageSelect: (index: number) => void
  allImages: { image: any; isMain: boolean }[]
  onClose: () => void
}

export default function PostDetail({
  post,
  selectedImageIndex,
  onImageSelect,
  allImages,
  onClose,
}: PostDetailProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (api) {
      api.scrollTo(selectedImageIndex)
    }
  }, [api, selectedImageIndex])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
      onImageSelect(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, onImageSelect])

  return (
    <div className="flex flex-col sm:flex-row gap-6 h-full">
      {/* Header section - always on top for mobile, left column for desktop */}
      <div className="sm:w-64 flex-shrink-0 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{post.title}</h1>
            {post.subtitle && (
              <p className="text-sm text-muted-foreground">{post.subtitle}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full font-normal text-xs">
              {new Date(post.date).getFullYear()}
            </Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full font-normal text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Body text - hidden on mobile, shown in left column on desktop */}
        {post.body && (
          <div className="hidden sm:block prose prose-sm max-w-none flex-1 overflow-y-auto">
            <PortableText value={post.body} />
          </div>
        )}

      </div>
      <div className='flex-1 flex items-center flex-col'>
        
        {allImages.length > 0 && (
          <div className=" flex items-start w-full">
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{
                align: 'center',
                loop: true,
              }}
            >
              <CarouselContent>
                {allImages.map((item, index) => {
                  const imageUrl = urlForImage(item.image)?.url()
                  if (!imageUrl) return null

                  return (
                    <CarouselItem key={index} className="flex items-center justify-center">
                      <div className="relative w-full aspect-[4/3] sm:h-[calc(100vh-6rem)] sm:aspect-auto flex items-center justify-center">
                        <Image
                          src={imageUrl}
                          alt={`${post.title} - image ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 70vw"
                        />
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          </div>
        )}
        {allImages.length > 1 && (
          <div className="sm:block text-sm text-muted-foreground mt-4">
            {current + 1} / {allImages.length}
          </div>
        )}
      </div>
     

      {/* Body text - mobile only, shown below carousel */}
      {post.body && (
        <div className="sm:hidden prose prose-sm max-w-none">
          <PortableText value={post.body} />
        </div>
      )}

    </div>
  )
}