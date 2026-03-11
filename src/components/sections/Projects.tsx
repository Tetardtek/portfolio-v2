'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Project, Technology, Lang } from '@/types'
import { TechBadgeList } from '@/components/ui/TechBadge'

interface Props {
  projects: Project[]
  lang: Lang
  stack: Technology[]
  t: {
    title: string
    subtitle: string
    demo: string
    code: string
    filter_all: string
  }
}

function FeaturedCard({ project, t, lang, stack, large }: { project: Project; t: Props['t']; lang: Lang; stack: Technology[]; large?: boolean }) {
  return (
    <motion.article
      className={`glass overflow-hidden group relative flex flex-col ${large ? 'row-span-2' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-high shrink-0 ${large ? 'h-56' : 'h-40'}`}>
        <Image
          src={project.img}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        <h3 className="font-mono font-bold text-pink text-lg leading-tight">{project.title}</h3>
        <p className="text-muted text-sm leading-relaxed flex-1">{project.description[lang]}</p>

        {/* Technos */}
        <TechBadgeList techno={project.techno} stack={stack} max={6} />

        {/* Links */}
        <div className="flex gap-3 pt-1">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-btn font-semibold text-sm text-white hover:opacity-90 transition-opacity bg-gradient-vc"
          >
            {t.demo}
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-btn border border-border text-muted hover:border-purple hover:text-purple text-sm transition-colors"
          >
            {t.code}
          </a>
        </div>
      </div>
    </motion.article>
  )
}

function CompactCard({ project, t, stack, delay }: { project: Project; t: Props['t']; stack: Technology[]; delay: number }) {
  return (
    <motion.article
      className="glass flex items-center gap-4 p-4 group"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ x: 4 }}
    >
      {/* Miniature */}
      <div className="relative w-14 h-14 rounded-btn overflow-hidden bg-high shrink-0">
        <Image src={project.img} alt={project.title} fill sizes="56px" className="object-cover" />
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h4 className="font-mono font-semibold text-text text-sm truncate">{project.title}</h4>
        <div className="mt-1.5">
          <TechBadgeList techno={project.techno} stack={stack} max={4} size="sm" />
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-2 shrink-0">
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          className="px-3 py-1 rounded-btn text-xs font-mono text-white hover:opacity-90 transition-opacity bg-gradient-vc"
        >
          {t.demo}
        </a>
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          className="px-3 py-1 rounded-btn border border-border text-xs font-mono text-muted hover:border-purple hover:text-purple transition-colors"
        >
          {t.code}
        </a>
      </div>
    </motion.article>
  )
}

const PAGE_SIZE = 6

export function Projects({ projects, lang, stack, t }: Props) {
  const stackNames = new Set(stack.map((s) => s.name))
  const allTechnos = Array.from(new Set(projects.flatMap((p) => p.techno).filter((n) => stackNames.has(n)))).sort()
  const [filter, setFilter] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const filtered = filter ? projects.filter((p) => p.techno.includes(filter)) : projects
  const featured = filtered
    .filter((p) => p.featured)
    .sort((a, b) => (b.spotlight ? 1 : 0) - (a.spotlight ? 1 : 0))
  const compact = filtered.filter((p) => !p.featured)
  const visibleCompact = showAll ? compact : compact.slice(0, PAGE_SIZE)

  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="font-mono text-xs text-cyan tracking-widest uppercase">{t.subtitle}</span>
        <h2 className="mt-2 text-4xl font-bold text-text">{t.title}</h2>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => { setFilter(null); setShowAll(false) }}
          className={`px-4 py-1.5 rounded-full font-mono text-sm border transition-colors ${filter === null ? 'border-pink text-pink bg-surface' : 'border-border text-muted hover:border-purple hover:text-purple'}`}
        >
          {t.filter_all}
        </button>
        {allTechnos.map((name) => {
          const tech = stack.find((s) => s.name === name)
          const isActive = filter === name
          return (
            <button
              key={name}
              onClick={() => { setFilter(name); setShowAll(false) }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-sm border transition-colors ${isActive ? 'border-pink text-pink bg-surface' : 'border-border text-muted hover:border-purple hover:text-purple'}`}
            >
              {tech?.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tech.img} alt="" className="w-3.5 h-3.5 object-contain" />
              )}
              {name}
            </button>
          )
        })}
      </div>

      {/* Bento grid — projets featured */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 auto-rows-auto">
          {featured.map((project) => {
            const isSpotlight = !!project.spotlight && featured.length > 2
            return (
              <div key={project.id} className={isSpotlight ? 'lg:col-span-2' : ''}>
                <FeaturedCard project={project} t={t} lang={lang} stack={stack} large={isSpotlight} />
              </div>
            )
          })}
        </div>
      )}

      {/* Liste compacte — projets non featured */}
      {compact.length > 0 && (
        <div className="flex flex-col gap-3">
          {featured.length > 0 && (
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Autres projets</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}
          {visibleCompact.map((project, i) => (
            <CompactCard key={project.id} project={project} t={t} stack={stack} delay={i * 0.06} />
          ))}

          {compact.length > PAGE_SIZE && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="self-center mt-2 px-6 py-2 font-mono text-sm border border-border text-muted rounded-btn hover:border-pink hover:text-pink transition-colors"
            >
              {showAll ? 'Voir moins' : `Voir plus (${compact.length - PAGE_SIZE} restants)`}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
