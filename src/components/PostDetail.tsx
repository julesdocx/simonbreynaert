import Image from 'next/image'
import { urlForImage } from '~/lib/sanity.image'
import type { Post } from '~/lib/sanity.queries'
import { PortableText } from '@portabletext/react'
import { Button } from '~/components/ui/button'
import { X } from 'lucide-react'
import { Badge } from '~/components/ui/badge'

interface PostDetailProps {
  post: Post
  selectedImageIndex: number
  onImageSelect: (index: number) => void
  allImages: Array<{ image: any; isMain: boolean }>
  onClose?: () => void // NEW prop
}

export default function PostDetail({ 
  post, 
  selectedImageIndex, 
  onImageSelect, 
  allImages,
  onClose
}: PostDetailProps) {
  const selectedImageData = allImages[selectedImageIndex]

  return (
    
    <div className="post-detail md:grid gap-6">
      {/* Left Column - Content */}
      <div className="space-y-4">
            <Button 
                size="sm"
                aria-label="Cancel"
                variant='secondary'
                onClick={onClose}
                >
                <X/>
            </Button>
        <div>
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          {post.date && (
            <p className="text-sm text-muted-foreground">
              {new Date(post.date).getFullYear()}
            </p>
          )}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <Badge key={i} variant='outline' className='rounded-full '>{tag}</Badge>
            ))}
          </div>
        )}

        {post.body && (
          <div className="prose prose-sm">
              <PortableText value={post.body}/>
          </div>
        )}
      </div>

      {/* Right Column - Images */}
      <div className="space-y-4">
        {/* Large selected image */}
        {selectedImageData && (() => {
          const imageUrl = urlForImage(selectedImageData.image)?.url()
          if (!imageUrl) return null
          
          return (
            <div className="mb-4">
              <Image
                src={imageUrl}
                alt={selectedImageData.isMain ? post.title : `Gallery image`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto max-h-[900px] object-contain "
                style={{
                  width: '100%',  
                  height: 'auto',
                }}
              />
            </div>
          )
        })()}

        {/* Thumbnail grid */}
        <div className="grid grid-cols-7 gap-2">
          {allImages.map((imageData, i) => {
            const imageUrl = urlForImage(imageData.image)?.url()
            if (!imageUrl) return null
            
            const isCurrentlySelected = i === selectedImageIndex
            
            return (
              <button
                key={i}
                onClick={() => onImageSelect(i)}
                className={`relative aspect-square overflow-hidden transition-all ${
                  isCurrentlySelected 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={imageData.isMain ? post.title : `Thumbnail ${i}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 100px"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}