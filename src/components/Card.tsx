import Image from 'next/image'
import { urlForImage } from '~/lib/sanity.image'
import type { Post } from '~/lib/sanity.queries'
import { Badge } from '~/components/ui/badge'

export default function Card({ 
  post, 
  onClick,
  isSelected = false,
  hasSelection = false,
  activeTags = [], // NEW prop
}: { 
  post: Post
  onClick?: () => void
  isSelected?: boolean
  hasSelection?: boolean
  activeTags?: string[] // NEW prop
}) {
  const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.url() : null

  return (
    <div className="card md:grid flex flex-col" onClick={onClick}>
      {imageUrl && (
        <div className="card__image">
          <Image
            src={imageUrl}
            alt={post.title}
            width={150}
            height={150}
            quality={50}
            style={{ 
              width: '100%', 
              height: 'auto', 
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      )}
      
      {/* Only show header when NO post is selected */}
      {!hasSelection && (
        <div className='card__header'>
          <h2>{post.title}</h2>
          <p className='text-sm text-neutral-400'>{post.subtitle}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex w-full flex-wrap gap-2 card__badges">
              <Badge className='rounded-full font-normal' variant='outline'>
                {new Date(post.date).getFullYear()}
              </Badge>
              {post.tags.map((tag) => {
                const isActiveTag = activeTags.includes(tag)
                return (
                  <Badge 
                    key={tag}
                    className={`rounded-full font-normal ${isActiveTag ? 'bg-green-500 text-white' : ''}`}
                    variant={isActiveTag ? 'default' : 'outline'}
                  >
                    {tag}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}