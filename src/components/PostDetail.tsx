// ~/components/PostDetail.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
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

// Helper to extract Vimeo ID from URL
const getVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
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

  const allMedia: { type: 'image' | 'vimeo'; src: string; alt?: string }[] = []

  // Or if using videos array:
  post.videos?.forEach((video) => {
    const vimeoId = getVimeoId(video.url)
    if (vimeoId) {
      allMedia.push({ type: 'vimeo', src: vimeoId, alt: video.title })
    }
  })

  // Add images
  allImages.forEach((item) => {
    const imageUrl = urlForImage(item.image)?.url()
    if (imageUrl) {
      allMedia.push({ type: 'image', src: imageUrl })
    }
  })

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
      {/* Header section */}
      <div className="sm:w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{post.title}</h1>
            {post.subtitle && (
              <p className="text-sm text-muted-foreground">{post.subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full text-xs">
              {new Date(post.date).getFullYear()}
            </Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Body text - desktop only */}
        {post.body && (
          <div className="hidden sm:block prose prose-sm max-w-none flex-1 overflow-y-auto">
            <PortableText value={post.body} />
          </div>
        )}

        {/* Media counter - desktop */}
        {allMedia.length > 1 && (
          <div className="hidden sm:block text-sm text-muted-foreground">
            {current + 1} / {allMedia.length}
          </div>
        )}
      </div>

      {/* Carousel */}
      {allMedia.length > 0 && (
        <div className="flex-1 flex items-center">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: 'center',
              loop: true,
            }}
          >
            <CarouselContent>
              {allMedia.map((media, index) => (
                <CarouselItem key={index} className="flex items-center justify-center">
                  {media.type === 'vimeo' ? (
                    <div className="relative w-full aspect-video sm:h-[calc(100vh-6rem)] sm:aspect-auto">
                      <iframe
                        src={`https://player.vimeo.com/video/${media.src}?autoplay=0&title=0&byline=0&portrait=0`}
                        className="absolute inset-0 w-full h-full rounded-md"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/3] sm:h-[calc(100vh-6rem)] sm:aspect-auto flex items-center justify-center">
                      <Image
                        src={media.src}
                        alt={media.alt || `${post.title} - image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 70vw"
                      />
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {allMedia.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Body text - mobile only */}
      {post.body && (
        <div className="sm:hidden prose prose-sm max-w-none">
          <PortableText value={post.body} />
        </div>
      )}

      {/* Media counter - mobile */}
      {allMedia.length > 1 && (
        <div className="sm:hidden text-sm text-muted-foreground text-center">
          {current + 1} / {allMedia.length}
        </div>
      )}
    </div>
  )
}