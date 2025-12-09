import { useState } from 'react'
import { ListFilter } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"

interface FilterTagsProps {
  allTags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
  collapsed?: boolean
}

export default function FilterTags({ allTags, activeTags, onToggleTag, collapsed = false }: FilterTagsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (collapsed) {
    return (
      <div className="flex flex-col gap-1">
        {activeTags.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {activeTags.length} filter{activeTags.length > 1 ? 's' : ''} active
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full relative"
        aria-label="Toggle filters"
      >
        <ListFilter size={18} /> Filters
        {activeTags.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-black text-white rounded-full flex items-center justify-center">
            {activeTags.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <ToggleGroup 
            type="multiple" 
            value={activeTags}
            onValueChange={(newValues) => {
              const added = newValues.find(tag => !activeTags.includes(tag))
              const removed = activeTags.find(tag => !newValues.includes(tag))
              const toggledTag = added || removed
              if (toggledTag) {
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
                  className={`
                    px-2.5 h-7 text-xs rounded-md border
                    data-[state=on]:bg-gray-200
                    rounded-full font-normal
                  `}
                >
                  {tag}
                </ToggleGroupItem>
              </motion.div>
            ))}
          </ToggleGroup>
        )}
      </AnimatePresence>
    </div>
  )
}