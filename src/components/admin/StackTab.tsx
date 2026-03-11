'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { Project, Technology } from '@/types'
import { SortableTechItem, SortableCategoryItem } from '@/components/admin/SortableItems'

type DescLang = 'fr' | 'en'

const input = 'w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--pink)] transition-colors'

interface Props {
  stack: Technology[]
  projects: Project[]
  selectedTechIdx: number | null
  setStack: React.Dispatch<React.SetStateAction<Technology[]>>
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  setSelectedTechIdx: React.Dispatch<React.SetStateAction<number | null>>
  onSave: () => void
}

export function StackTab({ stack, projects, selectedTechIdx, setStack, setProjects, setSelectedTechIdx, onSave }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function updateTech(idx: number, field: keyof Technology, value: string) {
    setStack((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)))
  }

  function addTech() {
    const newIdx = stack.length
    const defaultCat = stack[0]?.category ?? 'language'
    setStack((prev) => [...prev, { name: '', img: '', category: defaultCat }])
    setSelectedTechIdx(newIdx)
  }

  function removeTech(idx: number) {
    setStack((prev) => prev.filter((_, i) => i !== idx))
    setSelectedTechIdx(null)
  }

  function renameCategory(oldCat: string, newCat: string) {
    setStack((prev) => prev.map((t) => t.category === oldCat ? { ...t, category: newCat } : t))
  }

  function onDragEndInCategory(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = parseInt(active.id as string)
    const newIndex = parseInt(over.id as string)
    setStack((prev) => arrayMove(prev, oldIndex, newIndex))
    if (selectedTechIdx === oldIndex) setSelectedTechIdx(newIndex)
    else if (selectedTechIdx === newIndex) setSelectedTechIdx(oldIndex)
  }

  function onDragEndCategory(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const cats = Array.from(new Set(stack.map((t) => t.category)))
    const oldIdx = cats.indexOf(active.id as string)
    const newIdx = cats.indexOf(over.id as string)
    const newCats = arrayMove(cats, oldIdx, newIdx)
    // Rebuild flat array sorted by new category order, preserving within-category order
    setStack(newCats.flatMap((cat) => stack.filter((t) => t.category === cat)))
    setSelectedTechIdx(null)
  }

  async function handleSave() {
    // Nettoyage des refs orphelines dans les projets
    const stackNames = new Set(stack.map((t) => t.name))
    const cleanedProjects = projects.map((p) => ({
      ...p,
      techno: p.techno.filter((name) => stackNames.has(name)),
    }))
    setProjects(cleanedProjects)
    await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedProjects),
    })
    onSave()
  }

  const categories = Array.from(new Set(stack.map((t) => t.category)))

  return (
    <div className="flex gap-5 items-start">
      {/* Liste sortable — un DndContext par catégorie */}
      <div className="flex flex-col w-72 shrink-0">
        <div className="flex gap-2 mb-2">
          <button onClick={addTech} className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] font-mono text-sm border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors">
            + Nouvelle techno
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]" style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}>
            Sauvegarder
          </button>
        </div>
        {categories.map((cat) => {
          const groupItems = stack.map((t, i) => ({ tech: t, realIdx: i })).filter(({ tech }) => tech.category === cat)
          return (
            <div key={cat}>
              <p className="font-mono text-xs text-[var(--purple)] uppercase tracking-wider px-2 pt-3 pb-1 select-none">{cat}</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndInCategory}>
                <SortableContext items={groupItems.map(({ realIdx }) => realIdx.toString())} strategy={verticalListSortingStrategy}>
                  {groupItems.map(({ tech, realIdx }) => (
                    <SortableTechItem key={realIdx} tech={tech} idx={realIdx} isSelected={selectedTechIdx === realIdx} onClick={() => setSelectedTechIdx(realIdx === selectedTechIdx ? null : realIdx)} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )
        })}
      </div>

      {/* Panneau ordre des catégories */}
      <div className="flex flex-col w-36 shrink-0">
        <p className="font-mono text-xs text-[var(--text-muted)] px-1 pb-2 pt-0.5 uppercase tracking-wider">Catégories</p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndCategory}>
          <SortableContext items={categories} strategy={verticalListSortingStrategy}>
            {categories.map((cat) => (
              <SortableCategoryItem key={cat} cat={cat} onRename={renameCategory} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Formulaire */}
      <AnimatePresence>
        {selectedTechIdx !== null && stack[selectedTechIdx] && (
          <motion.div className="glass flex-1 p-6 flex flex-col gap-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} key={selectedTechIdx}>
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[var(--cyan)] font-semibold">{stack[selectedTechIdx].name || 'Nouvelle techno'}</h3>
              <button onClick={() => { if (window.confirm(`Supprimer "${stack[selectedTechIdx].name}" ?`)) removeTech(selectedTechIdx) }} className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
                ✕ Supprimer
              </button>
            </div>

            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">Nom</label>
              <input className={input} value={stack[selectedTechIdx].name} onChange={(e) => updateTech(selectedTechIdx, 'name', e.target.value)} />
            </div>
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">URL icône</label>
              <input className={input} placeholder="https://cdn.jsdelivr.net/..." value={stack[selectedTechIdx].img} onChange={(e) => updateTech(selectedTechIdx, 'img', e.target.value)} />
              {stack[selectedTechIdx].img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={stack[selectedTechIdx].img} alt="" className="mt-2 w-8 h-8 object-contain" />
              )}
            </div>
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-2">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(stack.map((t) => t.category).filter(Boolean))).map((cat) => (
                  <button key={cat} type="button" onClick={() => updateTech(selectedTechIdx, 'category', cat)}
                    className={`px-3 py-1 rounded-full font-mono text-xs border transition-colors ${stack[selectedTechIdx].category === cat ? 'border-[var(--cyan)] text-[var(--cyan)] bg-[var(--bg-high)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'}`}
                  >
                    {cat}
                  </button>
                ))}
                <input
                  className="px-3 py-1 rounded-full font-mono text-xs border border-dashed border-[var(--border)] bg-transparent text-[var(--text-muted)] focus:outline-none focus:border-[var(--cyan)] focus:text-[var(--cyan)] w-32 transition-colors"
                  placeholder="+ nouvelle..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      updateTech(selectedTechIdx, 'category', e.currentTarget.value.trim())
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>

            <button onClick={handleSave} className="self-end px-5 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]" style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}>
              Sauvegarder
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
