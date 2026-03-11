'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Project, Technology, Infrastructure } from '@/types'
import { ProjectsTab } from '@/components/admin/ProjectsTab'
import { StackTab } from '@/components/admin/StackTab'
import { InfraTab } from '@/components/admin/InfraTab'

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

  function flashSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveProjects() {
    await fetch('/api/admin/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projects) })
    flashSaved()
  }

  async function saveStack() {
    await fetch('/api/admin/stack', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stack) })
    flashSaved()
  }

  async function saveInfra() {
    await fetch('/api/admin/infra', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(infra) })
    flashSaved()
  }

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

      {tab === 'projects' && (
        <ProjectsTab projects={projects} stack={stack} selectedIdx={selectedIdx} descLang={descLang} setProjects={setProjects} setSelectedIdx={setSelectedIdx} setDescLang={setDescLang} onSave={saveProjects} />
      )}
      {tab === 'stack' && (
        <StackTab stack={stack} projects={projects} selectedTechIdx={selectedTechIdx} setStack={setStack} setProjects={setProjects} setSelectedTechIdx={setSelectedTechIdx} onSave={saveStack} />
      )}
      {tab === 'infra' && (
        <InfraTab infra={infra} stack={stack} selectedServiceIdx={selectedServiceIdx} descLang={descLang} setInfra={setInfra} setSelectedServiceIdx={setSelectedServiceIdx} setDescLang={setDescLang} onSave={saveInfra} />
      )}
    </div>
  )
}
