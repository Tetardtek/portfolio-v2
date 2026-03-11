'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { Infrastructure, Technology } from '@/types'
import { SortableServiceItem } from '@/components/admin/SortableItems'

type DescLang = 'fr' | 'en'

const input = 'w-full bg-base border border-border rounded-btn px-3 py-2 text-text text-sm font-mono focus:outline-none focus:border-pink transition-colors'

interface Props {
  infra: Infrastructure
  stack: Technology[]
  selectedServiceIdx: number | null
  descLang: DescLang
  setInfra: React.Dispatch<React.SetStateAction<Infrastructure>>
  setSelectedServiceIdx: React.Dispatch<React.SetStateAction<number | null>>
  setDescLang: React.Dispatch<React.SetStateAction<DescLang>>
  onSave: () => void
}

export function InfraTab({ infra, stack, selectedServiceIdx, descLang, setInfra, setSelectedServiceIdx, setDescLang, onSave }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function updateService(idx: number, field: string, value: string) {
    setInfra((prev) => ({ ...prev, services: prev.services.map((s, i) => i === idx ? { ...s, [field]: value } : s) }))
  }

  function updateServiceDesc(idx: number, lang: DescLang, value: string) {
    setInfra((prev) => ({ ...prev, services: prev.services.map((s, i) => i === idx ? { ...s, description: { ...s.description, [lang]: value } } : s) }))
  }

  function addService() {
    setInfra((prev) => ({ ...prev, services: [...prev.services, { name: '', description: { fr: '', en: '' }, url: '', img: '' }] }))
    setSelectedServiceIdx(infra.services.length)
  }

  function removeService(idx: number) {
    setInfra((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }))
    setSelectedServiceIdx(null)
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

  return (
    <div className="flex flex-col gap-5">
      {/* Description + specs du VPS */}
      <div className="glass p-5 flex flex-col gap-4">
        <h3 className="font-mono text-cyan font-semibold text-sm">VPS</h3>
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
          <textarea className={`${input} resize-none`} rows={2} value={infra.description[descLang]} onChange={(e) => setInfra((prev) => ({ ...prev, description: { ...prev.description, [descLang]: e.target.value } }))} />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted mb-2">Specs (technologies du stack)</label>
          <div className="flex flex-col gap-2 p-3 bg-base border border-border rounded-btn">
            {Array.from(new Set(stack.map((t) => t.category))).map((cat) => (
              <div key={cat}>
                <p className="font-mono text-xs text-border uppercase tracking-wider mb-1.5">{cat}</p>
                <div className="flex flex-wrap gap-1.5">
                  {stack.filter((t) => t.category === cat).map((tech) => {
                    const isOn = infra.specs.includes(tech.name)
                    return (
                      <button key={tech.name} type="button"
                        onClick={() => setInfra((prev) => ({ ...prev, specs: isOn ? prev.specs.filter((s) => s !== tech.name) : [...prev.specs, tech.name] }))}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border transition-colors ${isOn ? 'border-cyan text-cyan bg-high' : 'border-border text-muted hover:border-purple hover:text-purple'}`}
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
        <button onClick={onSave} className="self-end px-5 py-2 rounded-btn font-semibold text-sm text-white bg-gradient-vc">
          Sauvegarder
        </button>
      </div>

      {/* Services */}
      <div className="flex gap-5 items-start">
        <div className="flex flex-col w-72 shrink-0">
          <div className="flex gap-2 mb-2">
            <button onClick={addService} className="flex-1 px-4 py-2 rounded-btn font-mono text-sm border border-dashed border-border text-muted hover:border-cyan hover:text-cyan transition-colors">
              + Nouveau service
            </button>
            <button onClick={onSave} className="px-4 py-2 rounded-btn font-semibold text-sm text-white bg-gradient-vc">
              Sauvegarder
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndServices}>
            <SortableContext items={infra.services.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
              {infra.services.map((s, idx) => (
                <SortableServiceItem key={idx} service={s} idx={idx} isSelected={selectedServiceIdx === idx} onClick={() => setSelectedServiceIdx(idx === selectedServiceIdx ? null : idx)} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <AnimatePresence>
          {selectedServiceIdx !== null && infra.services[selectedServiceIdx] && (
            <motion.div className="glass flex-1 p-6 flex flex-col gap-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} key={selectedServiceIdx}>
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-cyan font-semibold">{infra.services[selectedServiceIdx].name || 'Nouveau service'}</h3>
                <button onClick={() => { if (window.confirm(`Supprimer "${infra.services[selectedServiceIdx].name}" ?`)) removeService(selectedServiceIdx) }} className="font-mono text-xs text-muted hover:text-danger transition-colors">
                  ✕ Supprimer
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-xs">Nom</label>
                  <input className={input} value={infra.services[selectedServiceIdx].name} onChange={(e) => updateService(selectedServiceIdx, 'name', e.target.value)} />
                </div>
                <div>
                  <label className="label-xs">URL (lien cliquable)</label>
                  <input className={input} placeholder="https://..." value={infra.services[selectedServiceIdx].url ?? ''} onChange={(e) => updateService(selectedServiceIdx, 'url', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label-xs">URL icône</label>
                  <input className={input} placeholder="https://cdn.jsdelivr.net/..." value={infra.services[selectedServiceIdx].img} onChange={(e) => updateService(selectedServiceIdx, 'img', e.target.value)} />
                  {infra.services[selectedServiceIdx].img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={infra.services[selectedServiceIdx].img} alt="" className="mt-2 w-8 h-8 object-contain" />
                  )}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-mono text-xs text-muted">Description</label>
                    <div className="flex gap-1 ml-auto">
                      {(['fr', 'en'] as DescLang[]).map((l) => (
                        <button key={l} onClick={() => setDescLang(l)} className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${descLang === l ? 'bg-high text-cyan border border-cyan' : 'text-muted border border-border hover:text-text'}`}>
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea className={`${input} resize-none`} rows={2} value={infra.services[selectedServiceIdx].description[descLang]} onChange={(e) => updateServiceDesc(selectedServiceIdx, descLang, e.target.value)} />
                </div>
              </div>

              <button onClick={onSave} className="self-end px-5 py-2 rounded-btn font-semibold text-sm text-white bg-gradient-vc">
                Sauvegarder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
