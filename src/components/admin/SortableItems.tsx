'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Project, Technology } from '@/types'

export function SortableProjectItem({ project, idx, isSelected, onClick }: {
  project: Project; idx: number; isSelected: boolean; onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} className="flex items-center gap-1">
      <span {...attributes} {...listeners} className="px-1 py-3 cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--text-muted)] touch-none">⠿</span>
      <button onClick={onClick} className={`flex-1 glass text-left px-3 py-3 flex items-center gap-3 mb-1 transition-colors ${isSelected ? 'border-[var(--pink)] text-[var(--pink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm truncate">{project.title}</p>
          <div className="flex gap-2 mt-0.5">
            {project.featured && <span className="text-xs font-mono text-[var(--purple)]">featured</span>}
            {project.spotlight && <span className="text-xs font-mono text-[var(--cyan)]">★ spotlight</span>}
          </div>
        </div>
        <span className="text-xs opacity-40">›</span>
      </button>
    </div>
  )
}

export function SortableTechItem({ tech, idx, isSelected, onClick }: {
  tech: Technology; idx: number; isSelected: boolean; onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: idx.toString() })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} className="flex items-center gap-1 mb-1">
      <span {...attributes} {...listeners} className="px-1 py-2 cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--text-muted)] touch-none" title="Glisser pour réordonner">⠿</span>
      <button onClick={onClick} className={`flex-1 glass text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${isSelected ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
        {tech.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tech.img} alt="" className="w-4 h-4 object-contain shrink-0" />
        )}
        <span className="font-mono text-sm truncate flex-1">{tech.name || 'Sans nom'}</span>
        {tech.category && <span className="font-mono text-xs text-[var(--border)] shrink-0">{tech.category}</span>}
      </button>
    </div>
  )
}

export function SortableCategoryItem({ cat, onRename }: { cat: string; onRename: (oldCat: string, newCat: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(cat)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat })

  function confirm() {
    const trimmed = value.trim()
    if (trimmed && trimmed !== cat) onRename(cat, trimmed)
    setEditing(false)
  }

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }} className="flex items-center gap-1 mb-1">
      <span {...attributes} {...listeners} className="px-1 cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--purple)] touch-none text-sm">⠿</span>
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={confirm}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirm()
            if (e.key === 'Escape') { setValue(cat); setEditing(false) }
          }}
          className="flex-1 px-3 py-1.5 bg-[var(--bg-base)] border border-[var(--cyan)] rounded-[var(--radius-sm)] font-mono text-xs text-[var(--cyan)] uppercase tracking-wider focus:outline-none"
        />
      ) : (
        <span onDoubleClick={() => { setValue(cat); setEditing(true) }} title="Double-clic pour renommer" className="flex-1 px-3 py-1.5 glass font-mono text-xs text-[var(--purple)] uppercase tracking-wider select-none cursor-text">
          {cat}
        </span>
      )}
    </div>
  )
}

export function SortableServiceItem({ service, idx, isSelected, onClick }: {
  service: { name: string; img: string; url?: string }; idx: number; isSelected: boolean; onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: idx.toString() })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} className="flex items-center gap-1 mb-1">
      <span {...attributes} {...listeners} className="px-1 py-2 cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--text-muted)] touch-none">⠿</span>
      <button onClick={onClick} className={`flex-1 glass text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${isSelected ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
        {service.img && <img src={service.img} alt="" className="w-4 h-4 object-contain shrink-0" />}
        <span className="font-mono text-sm truncate flex-1">{service.name || 'Sans nom'}</span>
        {service.url && <span className="text-xs text-[var(--border)]">↗</span>}
      </button>
    </div>
  )
}
