import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { urlForImage } from '~/lib/sanity.image'
import type { Post } from '~/lib/sanity.queries'
import { Badge } from '~/components/ui/badge'

export default function Card({ 
  post, 
  onClick,
  isSelected = false,
  hasSelection = false,
  activeTags = [],
}: { 
  post: Post
  onClick?: () => void
  isSelected?: boolean
  hasSelection?: boolean
  activeTags?: string[]
}) {
  const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.url() : null
  const [isHovered, setIsHovered] = useState(false)

  const allTags = [
    { label: new Date(post.date).getFullYear().toString(), isYear: true },  ...  post.tags.map(tag => ({ label: tag, isYear: false }))
  ]
  return (
    <div 
      className={`card flex flex-col break-column ${hasSelection? 'drop-shadow-sm px-4 py-3 mr-1' : ''}  rounded-sm`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
               
      {!hasSelection && (
        <div>
          {imageUrl && (
            <div className="card__image relative overflow-hidden rounded-sm">
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
        </div>
      )}
      <div className='pt-2 mb-1 pb-4 flex flex-col gap-2'>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2>{post.title}</h2>
            <p className='text-sm text-neutral-500'>{post.subtitle}</p>
          </div>
          <ArrowUpRight 
            size={18} 
            className={`
              flex-shrink-0 
              transition-transform duration-200
              ${isHovered ? 'rotate-45' : 'rotate-0'}
              ${isSelected ? 'rotate-45' : 'rotate-0'}
            `}
          />
        </div>
        {!hasSelection && (
          <div>
            {allTags && allTags.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-1 '>
                {allTags.map(({ label, isYear },index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="text-xs font-normal rounded-full relative"
                  >
                    {label  || 'Untagged'}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}