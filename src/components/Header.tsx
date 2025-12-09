import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from "@/components/ui/button"
import { ChevronDown, Mail, Instagram, Phone, ListFilter } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface HeaderProps {
  collapsed?: boolean
  allTags?: string[]
  activeTags?: string[]
  onToggleTag?: (tag: string) => void
}

export default function Header({ 
  collapsed = false,
  allTags = [],
  activeTags = [],
  onToggleTag
}: HeaderProps) {
  const [bioOpen, setBioOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  if (collapsed) {
    return (
      <header className="flex flex-col gap-2">
        <h2 className="font-bold text-sm">Simon Breynaert</h2>
        {activeTags.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {activeTags.length} filter{activeTags.length > 1 ? 's' : ''} active
          </span>
        )}
      </header>
    )
  }

  return (
    <header className="flex flex-col gap-3 pb-2">
      {/* Top row - name and buttons */}
      <div className="flex items-center justify-between gap-3 ">
        <h2 className="font-bold">Simon Breynaert</h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full"
            onClick={() => setBioOpen(!bioOpen)}
          >
            Bio / Contact
            <ChevronDown 
              size={14} 
              className={`ml-1 transition-transform ${bioOpen ? 'rotate-180' : ''}`}
            />
          </Button>

          <Button
            size="sm"
            variant='ghost'
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rounded-full relative"
            aria-label="Toggle filters"
          >
            <ListFilter size={16} />
            Filters
            {activeTags.length > 0 && !filtersOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-black text-white rounded-full flex items-center justify-center">
                {activeTags.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filter tags row */}
      <AnimatePresence>
        {filtersOpen && allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ToggleGroup 
              type="multiple" 
              value={activeTags}
              onValueChange={(newValues) => {
                const added = newValues.find(tag => !activeTags.includes(tag))
                const removed = activeTags.find(tag => !newValues.includes(tag))
                const toggledTag = added || removed
                if (toggledTag && onToggleTag) {
                  onToggleTag(toggledTag)
                }
              }}
              className="flex flex-wrap gap-1 justify-start"
            >
              {allTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ 
                    duration: 0.2,
                    delay: index * 0.03,
                    ease: 'easeOut'
                  }}
                >
                  <ToggleGroupItem
                    value={tag}
                    aria-label={`Toggle ${tag}`}
                    size="sm"
                    className="px-2.5 h-7 text-xs rounded-full border font-normal data-[state=on]:bg-gray-200"
                  >
                    {tag}
                  </ToggleGroupItem>
                </motion.div>
              ))}
            </ToggleGroup>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bio section */}
      <AnimatePresence>
        {bioOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 max-w-3xl">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Simon Breynaert is a Belgian visual artist and spatial designer working across photography, video, scenography and digital research. His practice explores how spaces are perceived, read and activated, using movement, observation and image-making as tools to translate architecture into atmospheric visual narratives.
                </p>
                <p className="text-sm text-muted-foreground">
                  Moving between autonomous work and commissioned projects, Simon creates visual identities, documents installations and performances, and develops spatial experiments that connect image, context and experience. Based in Brussels, he collaborates with designers, architects, cultural institutions and creative studios while pursuing an ongoing artistic research into perception, space and storytelling.
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-sm">Contact</h3>
                <a 
                  href="mailto:simonbreynaert@gmail.com" 
                  className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail size={14} />
                  simonbreynaert@gmail.com
                </a>
                <a 
                  href="https://instagram.com/smn_brynrt" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram size={14} />
                  @smn_brynrt
                </a>
                <a 
                  href="tel:+32495252010" 
                  className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone size={14} />
                  +32 495 25 20 10
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}