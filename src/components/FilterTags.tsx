import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
interface FilterTagsProps {
  allTags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
  collapsed?: boolean // NEW
}

export default function FilterTags({ allTags, activeTags, onToggleTag, collapsed = false }: FilterTagsProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col gap-1">
        <h2 className='font-bold text-sm'>Simon Breynaert</h2>
        {activeTags.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {activeTags.length} filter{activeTags.length > 1 ? 's' : ''} active
          </span>
        )}
      </div>
    )
  }

  return (
    <ToggleGroup 
      type="multiple" 
      value={activeTags}
      onValueChange={(newValues) => {
        // Find which tag was toggled
        const added = newValues.find(tag => !activeTags.includes(tag))
        const removed = activeTags.find(tag => !newValues.includes(tag))
        const toggledTag = added || removed
        if (toggledTag) {
          onToggleTag(toggledTag)
        }
      }}
      className="flex flex-wrap gap-1 justify-start"
    >
      <h2 className='mr-2 font-bold'>Simon Breynaert</h2>
      {allTags.map((tag) => (
        <ToggleGroupItem
          key={tag}
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
      ))}
    </ToggleGroup>
  )
}
