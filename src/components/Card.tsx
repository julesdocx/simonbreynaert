import Image from 'next/image'
import { useState, useEffect } from 'react'
import { urlForImage } from '~/lib/sanity.image'
import { type Post } from '~/lib/sanity.queries'
import { PortableText } from '@portabletext/react'
import { motion, AnimatePresence } from 'motion/react';

export default function Card({ post, expandAll }: { post: Post, expandAll?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
  setIsExpanded(expandAll ?? false)
}, [expandAll])

  return (
    <motion.div
      className={`card ${isExpanded ? "expanded": "" }`}  
      onClick={toggleAccordion}
      whileHover="hover"
      style={{ cursor: 'pointer' }}
    >
      <div className="card__container">
        <div className="card__header">
            {/* <p className="card__title">
                {post.title}
            </p> */}
            {post.gallery && post.gallery.length > 0 && (
              <div className="card__gallery--thumbs">
                {post.gallery.map((image, i) => (
                  <Image
                    key={image._key || i}
                    src={urlForImage(image).url()}
                    alt={image.alt || `Gallery image ${i + 1}`}
                    width={100}
                    height={100}
                    quality={5}
                    style={{
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      aspectRatio: '1/1'
                    }}
                  />
                ))}
              </div>
              )}
            {/* Toggle Slider */}
        </div>
        
        {/* <AnimatePresence>
          {isExpanded && (
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
              <div style={{ padding: '10px 0' }}>
                {post.mainImage ? (
                  <div className="image-container">
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{
                        width: '100%',  
                        height: 'auto',
                      }}
                    />
                  </div>
                ) : (
                  <div className="post__cover--none" />
                )}
                <div className="card__content">
                  <PortableText value={post.body} />
                </div>
              </div>
              {post.gallery && post.gallery.length > 0 && (
                <div className="gallery">
                  {post.gallery.map((image, i) => (
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
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </motion.div>
  )
}