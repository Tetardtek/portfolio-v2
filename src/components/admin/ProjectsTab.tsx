'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { Project, Technology } from '@/types'
import { SortableProjectItem } from '@/components/admin/SortableItems'

type DescLang = 'fr' | 'en'

const input = 'w-full bg-base border border-border rounded-btn px-3 py-2 text-text text-sm font-mono focus:outline-none focus:border-pink transition-colors'

interface Props {
  projects: Project[]
  stack: Technology[]
  selectedIdx: number | null
  descLang: DescLang
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>
  setDescLang: React.Dispatch<React.SetStateAction<DescLang>>
  onSave: () => void
}

export function ProjectsTab({ projects, stack, selectedIdx, descLang, setProjects, setSelectedIdx, setDescLang, onSave }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const selected = projects[selectedIdx ?? -1]

  function updateProject(idx: number, field: keyof Project, value: unknown) {
    setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)))
  }

  function updateDesc(idx: number, lang: DescLang, value: string) {
    setProjects((prev) => prev.map((p, i) =>
      i === idx ? { ...p, description: { ...p.description, [lang]: value } } : p
    ))
  }

  function setSpotlight(idx: number) {
    setProjects((prev) => prev.map((p, i) => ({ ...p, spotlight: i === idx })))
  }

  function addProject() {
    const newIdx = projects.length
    setProjects((prev) => [...prev, {
      id: `project-${Date.now()}`,
      title: 'Nouveau projet',
      description: { fr: '', en: '' },
      techno: [],
      img: '',
      link: '',
      github: '',
      featured: false,
      spotlight: false,
    }])
    setSelectedIdx(newIdx)
  }

  function removeProject(idx: number) {
    setProjects((prev) => prev.filter((_, i) => i !== idx))
    setSelectedIdx(null)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    setProjects((prev) => arrayMove(prev, oldIndex, newIndex))
    if (selectedIdx === oldIndex) setSelectedIdx(newIndex)
    else if (selectedIdx === newIndex) setSelectedIdx(oldIndex)
  }

  return (
    <div className="flex gap-5 items-start">
      {/* Liste */}
      <div className="flex flex-col w-72 shrink-0">
        <div className="flex gap-2 mb-2">
          <button onClick={addProject} className="flex-1 px-4 py-2 rounded-btn font-mono text-sm border border-dashed border-border text-muted hover:border-cyan hover:text-cyan transition-colors">
            + Nouveau projet
          </button>
          <button onClick={onSave} className="px-4 py-2 rounded-btn font-semibold text-sm text-white bg-gradient-vc">
            Sauvegarder
          </button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {projects.map((p, idx) => (
              <SortableProjectItem key={p.id} project={p} idx={idx} isSelected={selectedIdx === idx} onClick={() => setSelectedIdx(idx === selectedIdx ? null : idx)} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Formulaire */}
      <AnimatePresence>
        {selected && selectedIdx !== null && (
          <motion.div className="glass flex-1 p-6 flex flex-col gap-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} key={selectedIdx}>
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-purple font-semibold">{selected.title}</h3>
              <button onClick={() => { if (window.confirm(`Supprimer "${selected.title}" ?`)) removeProject(selectedIdx) }} className="font-mono text-xs text-muted hover:text-danger transition-colors">
                ✕ Supprimer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-xs">Titre</label>
                <input className={input} value={selected.title} onChange={(e) => updateProject(selectedIdx, 'title', e.target.value)} />
              </div>
              <div>
                <label className="label-xs">ID</label>
                <input className={input} value={selected.id} onChange={(e) => updateProject(selectedIdx, 'id', e.target.value)} />
              </div>
              <div>
                <label className="label-xs">Lien démo</label>
                <input className={input} value={selected.link} onChange={(e) => updateProject(selectedIdx, 'link', e.target.value)} />
              </div>
              <div>
                <label className="label-xs">GitHub</label>
                <input className={input} value={selected.github} onChange={(e) => updateProject(selectedIdx, 'github', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label-xs">Image (chemin)</label>
                <input className={input} value={selected.img} onChange={(e) => updateProject(selectedIdx, 'img', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block font-mono text-xs text-muted mb-2">Technologies</label>
                <div className="flex flex-col gap-3 p-3 bg-base border border-border rounded-btn">
                  {Array.from(new Set(stack.map((t) => t.category))).map((cat) => (
                    <div key={cat}>
                      <p className="font-mono text-xs text-border uppercase tracking-wider mb-1.5">{cat}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {stack.filter((t) => t.category === cat).map((tech) => {
                          const isOn = selected.techno.includes(tech.name)
                          return (
                            <button key={tech.name} type="button"
                              onClick={() => updateProject(selectedIdx, 'techno', isOn ? selected.techno.filter((n) => n !== tech.name) : [...selected.techno, tech.name])}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border transition-colors ${isOn ? 'border-pink text-pink bg-high' : 'border-border text-muted hover:border-purple hover:text-purple'}`}
                            >
                              {tech.img && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={tech.img} alt="" className="w-3.5 h-3.5 object-contain" />
                              )}
                              {tech.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description bilingue */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="font-mono text-xs text-muted">Description</label>
                <div className="flex gap-1 ml-auto">
                  {(['fr', 'en'] as DescLang[]).map((l) => (
                    <button key={l} onClick={() => setDescLang(l)} className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${descLang === l ? 'bg-high text-pink border border-pink' : 'text-muted border border-border hover:text-text'}`}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <textarea className={`${input} resize-none`} rows={3} value={selected.description[descLang]} onChange={(e) => updateDesc(selectedIdx, descLang, e.target.value)} />
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 font-mono text-xs text-muted cursor-pointer">
                <input type="checkbox" checked={selected.featured ?? false} onChange={(e) => updateProject(selectedIdx, 'featured', e.target.checked)} className="accent-pink" />
                Mis en avant (bento)
              </label>
              <label className={`flex items-center gap-2 font-mono text-xs cursor-pointer ${selected.featured ? 'text-cyan' : 'text-border pointer-events-none'}`}>
                <input type="radio" name="spotlight" checked={selected.spotlight ?? false} disabled={!selected.featured} onChange={() => setSpotlight(selectedIdx)} className="accent-cyan" />
                ★ Spotlight
              </label>
            </div>

            <button onClick={onSave} className="self-end px-5 py-2 rounded-btn font-semibold text-sm text-white bg-gradient-vc">
              Sauvegarder
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
