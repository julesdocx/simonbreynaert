import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ChevronDown, Mail, Instagram, Phone, ListFilter, ArrowLeft, Linkedin, Globe, Video } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { urlForImage } from '~/lib/sanity.image'
import type { Bio } from '~/lib/sanity.queries'

interface HeaderProps {
  collapsed?: boolean
  allTags?: string[]
  activeTags?: string[]
  onToggleTag?: (tag: string) => void
  onBack?: () => void
  bio?: Bio | null
}

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram size={14} />,
  linkedin: <Linkedin size={14} />,
  twitter: <Globe size={14} />,
  vimeo: <Video size={14} />,
  behance: <Globe size={14} />,
  website: <Globe size={14} />,
}

export default function Header({ 
  collapsed = false,
  allTags = [],
  activeTags = [],
  onToggleTag,
  onBack,
  bio
}: HeaderProps) {
  const [bioOpen, setBioOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  if (collapsed) {
    return (
      <header className="py-2">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft size={18} />
          Back
        </Button>
      </header>
    )
  }

  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
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
            variant={filtersOpen || activeTags.length > 0 ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rounded-full relative"
            aria-label="Toggle filters"
          >
            <ListFilter size={16} />
            Filter
            {activeTags.length > 0 && !filtersOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-black text-white rounded-full flex items-center justify-center">
                {activeTags.length}
              </span>
            )}
          </Button>
        </div>
      </div>

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
              className="flex flex-wrap gap-1 justify-start pb-2"
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

      <AnimatePresence>
        {bioOpen && bio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
              {/* Column 1: Bio text */}
              <div>
                <p className="text-sm text-muted-foreground whitespace-pre-line text-black">
                  {bio.bioText}
                </p>
              </div>

              {/* Column 2: Contact */}
              <div className="flex flex-col gap-2">
                
                {bio.email && (
                  <a 
                    href={`mailto:${bio.email}`}
                    className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail size={14} />
                    {bio.email}
                  </a>
                )}
                
                {bio.phone && (
                  <a 
                    href={`tel:${bio.phone.replace(/\s/g, '')}`}
                    className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone size={14} />
                    {bio.phone}
                  </a>
                )}
                
                {bio.socials?.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {platformIcons[social.platform] || <Globe size={14} />}
                    {social.handle || social.platform}
                  </a>
                ))}
              </div>

              {/* Column 3: Selected Clients */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm ">Selected Clients:</h3>
                {bio.selectedClients && bio.selectedClients.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {bio.selectedClients.map((client, index) => (
                      client.url ? (
                        <a
                          key={index}
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {client.name}
                        </a>
                      ) : (
                        <span 
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {client.name}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Column 4: Profile Photo */}
              <div className="flex flex-col gap-2">
                {bio.profilePhoto && (
                  <div className="relative w-32 h-32 rounded-md overflow-hidden">
                    <Image
                      src={urlForImage(bio.profilePhoto)?.url() || ''}
                      alt="Simon Breynaert"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}