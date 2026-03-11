'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Project, Technology, Infrastructure } from '@/types'

function SortableCategoryItem({ cat, onRename }: { cat: string; onRename: (oldCat: string, newCat: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(cat)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat })

  function confirm() {
    const trimmed = value.trim()
    if (trimmed && trimmed !== cat) onRename(cat, trimmed)
    setEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-1 mb-1"
    >
      <span
        {...attributes}
        {...listeners}
        className="px-1 cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--purple)] touch-none text-sm"
      >
        ⠿
      </span>
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
        <span
          onDoubleClick={() => { setValue(cat); setEditing(true) }}
          title="Double-clic pour renommer"
          className="flex-1 px-3 py-1.5 glass font-mono text-xs text-[var(--purple)] uppercase tracking-wider select-none cursor-text"
        >
          {cat}
        </span>
      )}
    </div>
  )
}

function SortableTechItem({
  tech, idx, isSelected, onClick,
}: {
  tech: Technology; idx: number; isSelected: boolean; onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: idx.toString() })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-1 mb-1"
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="px-1 py-2 cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--text-muted)] touch-none"
        title="Glisser pour réordonner"
      >
        ⠿
      </span>
      <button
        onClick={onClick}
        className={`flex-1 glass text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${isSelected ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
      >
        {tech.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tech.img} alt="" className="w-4 h-4 object-contain shrink-0" />
        )}
        <span className="font-mono text-sm truncate flex-1">{tech.name || 'Sans nom'}</span>
        {tech.category && (
          <span className="font-mono text-xs text-[var(--border)] shrink-0">{tech.category}</span>
        )}
      </button>
    </div>
  )
}

function SortableProjectItem({ project, idx, isSelected, onClick }: {
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

function SortableServiceItem({ service, idx, isSelected, onClick }: {
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

type Tab = 'projects' | 'stack' | 'infra'
type DescLang = 'fr' | 'en'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [stack, setStack] = useState<Technology[]>([])
  const [infra, setInfra] = useState<Infrastructure>({ description: { fr: '', en: '' }, specs: [], services: [] })
  const [saved, setSaved] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [selectedTechIdx, setSelectedTechIdx] = useState<number | null>(null)
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number | null>(null)
  const [descLang, setDescLang] = useState<DescLang>('fr')

  useEffect(() => {
    fetch('/api/admin/projects').then((r) => r.json()).then(setProjects)
    fetch('/api/admin/stack').then((r) => r.json()).then(setStack)
    fetch('/api/admin/infra').then((r) => r.json()).then(setInfra)
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  async function saveProjects() {
    await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects),
    })
    flashSaved()
  }

  async function saveStack() {
    await fetch('/api/admin/stack', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stack),
    })

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

    flashSaved()
  }

  function flashSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function onDragEndProjects(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    setProjects((prev) => arrayMove(prev, oldIndex, newIndex))
    if (selectedIdx === oldIndex) setSelectedIdx(newIndex)
    else if (selectedIdx === newIndex) setSelectedIdx(oldIndex)
  }

  function onDragEndServices(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = parseInt(active.id as string)
    const newIndex = parseInt(over.id as string)
    setInfra((prev) => ({ ...prev, services: arrayMove(prev.services, oldIndex, newIndex) }))
    if (selectedServiceIdx === oldIndex) setSelectedServiceIdx(newIndex)
    else if (selectedServiceIdx === newIndex) setSelectedServiceIdx(oldIndex)
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

  function renameCategory(oldCat: string, newCat: string) {
    setStack((prev) => prev.map((t) => t.category === oldCat ? { ...t, category: newCat } : t))
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

  async function saveInfra() {
    await fetch('/api/admin/infra', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(infra),
    })
    flashSaved()
  }

  function updateService(idx: number, field: string, value: string) {
    setInfra((prev) => ({
      ...prev,
      services: prev.services.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }))
  }

  function updateServiceDesc(idx: number, lang: DescLang, value: string) {
    setInfra((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === idx ? { ...s, description: { ...s.description, [lang]: value } } : s
      ),
    }))
  }

  function addService() {
    setInfra((prev) => ({
      ...prev,
      services: [...prev.services, { name: '', description: { fr: '', en: '' }, url: '', img: '' }],
    }))
    setSelectedServiceIdx(infra.services.length)
  }

  function removeService(idx: number) {
    setInfra((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }))
    setSelectedServiceIdx(null)
  }

  const input = 'w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--pink)] transition-colors'
  const selected = projects[selectedIdx ?? -1]

  return (
    <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto" style={{ background: 'var(--bg-base)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono text-[var(--pink)] text-xl font-bold">~/admin/dashboard</h1>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span className="font-mono text-xs text-[var(--success)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ✓ Sauvegardé
            </motion.span>
          )}
          <button onClick={logout} className="px-3 py-1.5 font-mono text-xs border border-[var(--border)] text-[var(--text-muted)] rounded-[var(--radius-sm)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['projects', 'stack', 'infra'] as Tab[]).map((t) => (
          <button key={t} onClick={() => { setTab(t); setSelectedIdx(null); setSelectedServiceIdx(null) }}
            className={`px-4 py-1.5 rounded-[var(--radius-sm)] font-mono text-sm transition-colors ${tab === t ? 'bg-[var(--bg-surface)] border border-[var(--pink)] text-[var(--pink)]' : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── PROJECTS ── */}
      {tab === 'projects' && (
        <div className="flex gap-5 items-start">

          {/* Liste */}
          <div className="flex flex-col w-72 shrink-0">
            <div className="flex gap-2 mb-2">
              <button onClick={addProject}
                className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] font-mono text-sm border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
              >
                + Nouveau projet
              </button>
              <button onClick={saveProjects}
                className="px-4 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]"
                style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}
              >
                Sauvegarder
              </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndProjects}>
              <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                {projects.map((p, idx) => (
                  <SortableProjectItem
                    key={p.id}
                    project={p}
                    idx={idx}
                    isSelected={selectedIdx === idx}
                    onClick={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Formulaire */}
          <AnimatePresence>
            {selected && selectedIdx !== null && (
              <motion.div
                className="glass flex-1 p-6 flex flex-col gap-4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                key={selectedIdx}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[var(--purple)] font-semibold">{selected.title}</h3>
                  <button onClick={() => { if (window.confirm(`Supprimer "${selected.title}" ?`)) removeProject(selectedIdx) }} className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
                    ✕ Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">Titre</label>
                    <input className={input} value={selected.title} onChange={(e) => updateProject(selectedIdx, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">ID</label>
                    <input className={input} value={selected.id} onChange={(e) => updateProject(selectedIdx, 'id', e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">Lien démo</label>
                    <input className={input} value={selected.link} onChange={(e) => updateProject(selectedIdx, 'link', e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">GitHub</label>
                    <input className={input} value={selected.github} onChange={(e) => updateProject(selectedIdx, 'github', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">Image (chemin)</label>
                    <input className={input} value={selected.img} onChange={(e) => updateProject(selectedIdx, 'img', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-mono text-xs text-[var(--text-muted)] mb-2">Technologies</label>
                    <div className="flex flex-col gap-3 p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--radius-sm)]">
                      {Array.from(new Set(stack.map((t) => t.category))).map((cat) => (
                        <div key={cat}>
                          <p className="font-mono text-xs text-[var(--border)] uppercase tracking-wider mb-1.5">{cat}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {stack.filter((t) => t.category === cat).map((tech) => {
                              const isOn = selected.techno.includes(tech.name)
                              return (
                                <button
                                  key={tech.name}
                                  type="button"
                                  onClick={() => {
                                    const next = isOn
                                      ? selected.techno.filter((n) => n !== tech.name)
                                      : [...selected.techno, tech.name]
                                    updateProject(selectedIdx, 'techno', next)
                                  }}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border transition-colors ${isOn ? 'border-[var(--pink)] text-[var(--pink)] bg-[var(--bg-high)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'}`}
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
                    <label className="font-mono text-xs text-[var(--text-muted)]">Description</label>
                    <div className="flex gap-1 ml-auto">
                      {(['fr', 'en'] as DescLang[]).map((l) => (
                        <button key={l} onClick={() => setDescLang(l)}
                          className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${descLang === l ? 'bg-[var(--bg-high)] text-[var(--pink)] border border-[var(--pink)]' : 'text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'}`}
                        >
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className={`${input} resize-none`}
                    rows={3}
                    value={selected.description[descLang]}
                    onChange={(e) => updateDesc(selectedIdx, descLang, e.target.value)}
                  />
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] cursor-pointer">
                    <input type="checkbox" checked={selected.featured ?? false}
                      onChange={(e) => updateProject(selectedIdx, 'featured', e.target.checked)}
                      className="accent-[var(--pink)]"
                    />
                    Mis en avant (bento)
                  </label>
                  <label className={`flex items-center gap-2 font-mono text-xs cursor-pointer ${selected.featured ? 'text-[var(--cyan)]' : 'text-[var(--border)] pointer-events-none'}`}>
                    <input type="radio" name="spotlight" checked={selected.spotlight ?? false}
                      disabled={!selected.featured}
                      onChange={() => setSpotlight(selectedIdx)}
                      className="accent-[var(--cyan)]"
                    />
                    ★ Spotlight
                  </label>
                </div>

                <button onClick={saveProjects}
                  className="self-end px-5 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]"
                  style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}
                >
                  Sauvegarder
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── STACK ── */}
      {tab === 'stack' && (
        <div className="flex gap-5 items-start">
          {/* Liste sortable — un DndContext par catégorie */}
          <div className="flex flex-col w-72 shrink-0">
            <div className="flex gap-2 mb-2">
              <button onClick={addTech}
                className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] font-mono text-sm border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
              >
                + Nouvelle techno
              </button>
              <button onClick={saveStack}
                className="px-4 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]"
                style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}
              >
                Sauvegarder
              </button>
            </div>
            {Array.from(new Set(stack.map((t) => t.category))).map((cat) => {
              const groupItems = stack
                .map((t, i) => ({ tech: t, realIdx: i }))
                .filter(({ tech }) => tech.category === cat)
              return (
                <div key={cat}>
                  <p className="font-mono text-xs text-[var(--purple)] uppercase tracking-wider px-2 pt-3 pb-1 select-none">
                    {cat}
                  </p>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndInCategory}>
                    <SortableContext items={groupItems.map(({ realIdx }) => realIdx.toString())} strategy={verticalListSortingStrategy}>
                      {groupItems.map(({ tech, realIdx }) => (
                        <SortableTechItem
                          key={realIdx}
                          tech={tech}
                          idx={realIdx}
                          isSelected={selectedTechIdx === realIdx}
                          onClick={() => setSelectedTechIdx(realIdx === selectedTechIdx ? null : realIdx)}
                        />
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
              <SortableContext
                items={Array.from(new Set(stack.map((t) => t.category)))}
                strategy={verticalListSortingStrategy}
              >
                {Array.from(new Set(stack.map((t) => t.category))).map((cat) => (
                  <SortableCategoryItem key={cat} cat={cat} onRename={renameCategory} />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Formulaire */}
          <AnimatePresence>
            {selectedTechIdx !== null && stack[selectedTechIdx] && (
              <motion.div
                className="glass flex-1 p-6 flex flex-col gap-4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                key={selectedTechIdx}
              >
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
                    {Array.from(new Set(stack.map((t) => t.category).filter(Boolean))).map((cat) => {
                      const isActive = stack[selectedTechIdx].category === cat
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => updateTech(selectedTechIdx, 'category', cat)}
                          className={`px-3 py-1 rounded-full font-mono text-xs border transition-colors ${isActive ? 'border-[var(--cyan)] text-[var(--cyan)] bg-[var(--bg-high)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'}`}
                        >
                          {cat}
                        </button>
                      )
                    })}
                    {/* Nouvelle catégorie */}
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

                <button onClick={saveStack}
                  className="self-end px-5 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]"
                  style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}
                >
                  Sauvegarder
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── INFRA ── */}
      {tab === 'infra' && (
        <div className="flex flex-col gap-5">

          {/* Description + specs du VPS */}
          <div className="glass p-5 flex flex-col gap-4">
            <h3 className="font-mono text-[var(--cyan)] font-semibold text-sm">VPS</h3>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="font-mono text-xs text-[var(--text-muted)]">Description</label>
                <div className="flex gap-1 ml-auto">
                  {(['fr', 'en'] as DescLang[]).map((l) => (
                    <button key={l} onClick={() => setDescLang(l)}
                      className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${descLang === l ? 'bg-[var(--bg-high)] text-[var(--pink)] border border-[var(--pink)]' : 'text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'}`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className={`${input} resize-none`}
                rows={2}
                value={infra.description[descLang]}
                onChange={(e) => setInfra((prev) => ({ ...prev, description: { ...prev.description, [descLang]: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[var(--text-muted)] mb-2">Specs (technologies du stack)</label>
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--radius-sm)]">
                {Array.from(new Set(stack.map((t) => t.category))).map((cat) => (
                  <div key={cat}>
                    <p className="font-mono text-xs text-[var(--border)] uppercase tracking-wider mb-1.5">{cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.filter((t) => t.category === cat).map((tech) => {
                        const isOn = infra.specs.includes(tech.name)
                        return (
                          <button
                            key={tech.name}
                            type="button"
                            onClick={() => setInfra((prev) => ({
                              ...prev,
                              specs: isOn ? prev.specs.filter((s) => s !== tech.name) : [...prev.specs, tech.name],
                            }))}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border transition-colors ${isOn ? 'border-[var(--cyan)] text-[var(--cyan)] bg-[var(--bg-high)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'}`}
                          >
                            {tech.img && <img src={tech.img} alt="" className="w-3.5 h-3.5 object-contain" />}
                            {tech.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={saveInfra} className="self-end px-5 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]" style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}>
              Sauvegarder
            </button>
          </div>

          {/* Services */}
          <div className="flex gap-5 items-start">
            <div className="flex flex-col w-72 shrink-0">
              <div className="flex gap-2 mb-2">
                <button onClick={addService} className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] font-mono text-sm border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors">
                  + Nouveau service
                </button>
                <button onClick={saveInfra}
                  className="px-4 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]"
                  style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}
                >
                  Sauvegarder
                </button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndServices}>
                <SortableContext items={infra.services.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                  {infra.services.map((s, idx) => (
                    <SortableServiceItem
                      key={idx}
                      service={s}
                      idx={idx}
                      isSelected={selectedServiceIdx === idx}
                      onClick={() => setSelectedServiceIdx(idx === selectedServiceIdx ? null : idx)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <AnimatePresence>
              {selectedServiceIdx !== null && infra.services[selectedServiceIdx] && (
                <motion.div
                  className="glass flex-1 p-6 flex flex-col gap-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  key={selectedServiceIdx}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-[var(--cyan)] font-semibold">{infra.services[selectedServiceIdx].name || 'Nouveau service'}</h3>
                    <button onClick={() => { if (window.confirm(`Supprimer "${infra.services[selectedServiceIdx].name}" ?`)) removeService(selectedServiceIdx) }} className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
                      ✕ Supprimer
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">Nom</label>
                      <input className={input} value={infra.services[selectedServiceIdx].name} onChange={(e) => updateService(selectedServiceIdx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">URL (lien cliquable)</label>
                      <input className={input} placeholder="https://..." value={infra.services[selectedServiceIdx].url ?? ''} onChange={(e) => updateService(selectedServiceIdx, 'url', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-mono text-xs text-[var(--text-muted)] mb-1">URL icône</label>
                      <input className={input} placeholder="https://cdn.jsdelivr.net/..." value={infra.services[selectedServiceIdx].img} onChange={(e) => updateService(selectedServiceIdx, 'img', e.target.value)} />
                      {infra.services[selectedServiceIdx].img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={infra.services[selectedServiceIdx].img} alt="" className="mt-2 w-8 h-8 object-contain" />
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <label className="font-mono text-xs text-[var(--text-muted)]">Description</label>
                        <div className="flex gap-1 ml-auto">
                          {(['fr', 'en'] as DescLang[]).map((l) => (
                            <button key={l} onClick={() => setDescLang(l)}
                              className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${descLang === l ? 'bg-[var(--bg-high)] text-[var(--cyan)] border border-[var(--cyan)]' : 'text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'}`}
                            >
                              {l.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        className={`${input} resize-none`}
                        rows={2}
                        value={infra.services[selectedServiceIdx].description[descLang]}
                        onChange={(e) => updateServiceDesc(selectedServiceIdx, descLang, e.target.value)}
                      />
                    </div>
                  </div>

                  <button onClick={saveInfra} className="self-end px-5 py-2 rounded-[var(--radius-sm)] font-semibold text-sm text-[var(--bg-base)]" style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))' }}>
                    Sauvegarder
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
