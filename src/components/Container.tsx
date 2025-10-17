import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function Container({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLong, setIsLong] = useState(true)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)

  useEffect(() => {
    // Only trigger the animation when transitioning to or from the root
    if (router.pathname === '/') {
      setIsLong(true)
    } else {
      setIsLong(false)
    }
  }, [router.pathname])

  const toggleHeader = () => {
    setIsHeaderExpanded(!isHeaderExpanded)
  }

  return (
    <div className={`container ${!isHeaderExpanded ? 'header-collapsed' : ''}`}>
      <header className="header">
        <div 
          className='header_container'
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={toggleHeader}
        >
          <h1 className="header__title">
              Simon Breynaert
          </h1>
          {/* Toggle Slider */}
        </div>
        
        <AnimatePresence>
          {isHeaderExpanded && (
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
              <div style={{ padding: '0px 0' }}>
                <p>Brussels, Belgium<br />breynaertsimon@gmail.com</p>
                {/* <p>I'm a Belgian film editor with a fresh perspective and a deep passion for storytelling. I graduated in 2023 with a Master's degree in Editing from RITCS School of Arts. Since graduating, I've had the privilege of working on several short films, both national and international, and assisting acclaimed filmmakers and editors. These experiences have honed my skills and deepened my understanding of the collaborative nature of filmmaking. </p> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main>{children}</main>
    </div>
  )
}