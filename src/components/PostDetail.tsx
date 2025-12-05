// ~/components/PostDetail.tsx
import Image from 'next/image'
import { X } from 'lucide-react'
import { PortableText } from '@portabletext/react'
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
  allImages,
  onClose,
}: PostDetailProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header - two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left column - title, tags */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">{post.title}</h1>
              {post.subtitle && (
                <p className="text-sm text-muted-foreground">{post.subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-full transition-colors sm:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tags */}
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
        </div>

        {/* Right column - body text */}
        <div className="flex flex-col gap-3">
          <div className="hidden sm:flex justify-end">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {post.body && (
            <div className="prose prose-sm max-w-none">
              <PortableText value={post.body} />
            </div>
          )}
        </div>
      </div>

      {/* Image grid - masonry */}
      {allImages.length > 0 && (
        <div className="columns-1 sm:columns-2 gap-2">
          {allImages.map((item, index) => {
            const imageUrl = urlForImage(item.image)?.url()
            if (!imageUrl) return null

            return (
              <div
                key={index}
                className="mb-2 break-inside-avoid"
              >
                <Image
                  src={imageUrl}
                  alt={`${post.title} - image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-md"
                  style={{ display: 'block' }}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}