// ~/components/FilterTags.tsx
import { Toggle } from '~/components/ui/toggle'

interface FilterTagsProps {
  allTags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
}

export default function FilterTags({ allTags, activeTags, onToggleTag }: FilterTagsProps) {
  return (
    <div className="flex">
      {allTags.map((tag) => {
        const isActive = activeTags.includes(tag)
        
        return (
          <Toggle
            key={tag}
            pressed={isActive}
            onPressedChange={() => onToggleTag(tag)}
            aria-label={`Toggle ${tag}`}
            size='sm'
            className={`
              rounded-full px-3 h-8 text-sm
              ${isActive ? 'bg-green-500 text-white data-[state=on]:bg-green-500 data-[state=on]:text-white' : ''}
            `}
          >
            {tag}
          </Toggle>
        )
      })}
    </div>
  )
}