'use client'

import { useState } from 'react'
import type { Technology } from '@/types'

interface TechBadgeProps {
  name: string
  stack: Technology[]
  size?: 'sm' | 'md'
}

export function TechBadge({ name, stack, size = 'md' }: TechBadgeProps) {
  const tech = stack.find((t) => t.name === name)
  const isSmall = size === 'sm'
  return (
    <span className={`flex items-center gap-1 rounded-full font-mono bg-high border border-border text-cyan ${isSmall ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'}`}>
      {tech?.img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tech.img} alt="" className={isSmall ? 'w-3 h-3 object-contain' : 'w-3.5 h-3.5 object-contain'} />
      )}
      {name}
    </span>
  )
}

interface TechBadgeListProps {
  techno: string[]
  stack: Technology[]
  max: number
  size?: 'sm' | 'md'
}

export function TechBadgeList({ techno, stack, max, size = 'md' }: TechBadgeListProps) {
  const [expanded, setExpanded] = useState(false)
  // On n'affiche que les techs présentes dans le stack — cohérence garantie
  const known = techno.filter((name) => stack.some((s) => s.name === name))
  const visible = expanded ? known : known.slice(0, max)
  const hidden = known.length - max

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((name) => (
        <TechBadge key={name} name={name} stack={stack} size={size} />
      ))}
      {!expanded && hidden > 0 && (
        <button
          onClick={(e) => { e.preventDefault(); setExpanded(true) }}
          className="px-2 py-0.5 rounded-full font-mono text-xs border border-dashed border-border text-muted hover:border-cyan hover:text-cyan transition-colors"
          title={techno.slice(max).join(', ')}
        >
          +{hidden}
        </button>
      )}
      {expanded && hidden > 0 && (
        <button
          onClick={(e) => { e.preventDefault(); setExpanded(false) }}
          className="px-2 py-0.5 rounded-full font-mono text-xs border border-dashed border-border text-muted hover:border-pink hover:text-pink transition-colors"
        >
          ↑
        </button>
      )}
    </div>
  )
}
