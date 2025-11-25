// ~/components/FilterTags.tsx
import { Toggle } from '~/components/ui/toggle'
import { Circle } from 'lucide-react'

interface FilterTagsProps {
  allTags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
}

export default function FilterTags({ allTags, activeTags, onToggleTag }: FilterTagsProps) {
  return (
    <div className="hidden md:flex flex-col grow-0 items-end py-4">
      {allTags.map((tag) => {
        const isActive = activeTags.includes(tag)
        
        return (
          <Toggle
            key={tag}
            pressed={isActive}
            onPressedChange={() => onToggleTag(tag)}
            aria-label={`Toggle ${tag}`}
            size='sm'
            className="w-fit mb-1"
          >
            <Circle 
              className={isActive ? 'fill-green-500 text-green-500' : ''}
              size={16}
            />
            {tag}
          </Toggle>
        )
      })}
    </div>
  )
}