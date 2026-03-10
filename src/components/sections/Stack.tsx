'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Technology } from '@/types'

interface Props {
  stack: Technology[]
  techCounts: Record<string, number>
  t: {
    title: string
    subtitle: string
    categories: Record<string, string>
  }
}

export function Stack({ stack, techCounts, t }: Props) {
  // Ordre des catégories = ordre d'apparition dans le JSON (défini par l'admin)
  const categories = Array.from(new Set(stack.map((tech) => tech.category)))

  const grouped = categories.reduce<Record<string, Technology[]>>((acc, cat) => {
    acc[cat] = stack.filter((tech) => tech.category === cat)
    return acc
  }, {})

  return (
    <section id="stack" className="py-24 px-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="font-mono text-xs text-[var(--cyan)] tracking-widest uppercase">{t.subtitle}</span>
        <h2 className="mt-2 text-4xl font-bold text-[var(--text)]">{t.title}</h2>
      </motion.div>

      <div className="flex flex-col gap-12">
        {categories.map((cat, groupIdx) => { const items = grouped[cat]; return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: groupIdx * 0.08 }}
          >
            {/* Catégorie label + ligne décorative */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs text-[var(--purple)] uppercase tracking-widest shrink-0">
                {t.categories[cat] ?? cat}
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(231,156,254,0.3), transparent)' }} />
            </div>

            {/* Grille de cards */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {items.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  className="relative glass flex flex-col items-center gap-2 px-3 py-4 cursor-default group"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: groupIdx * 0.08 + i * 0.04, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.05, boxShadow: '0 0 16px rgba(255,121,198,0.35)', borderColor: 'rgba(255,121,198,0.5)' }}
                >
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={tech.img}
                      alt={tech.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-muted)] text-center leading-tight group-hover:text-[var(--text)] transition-colors">
                    {tech.name}
                  </span>
                  {(techCounts[tech.name] ?? 0) > 0 && (
                    <span className="absolute bottom-1.5 right-2 font-mono text-[10px] text-[var(--border)] group-hover:text-[var(--text-muted)] transition-colors">
                      ×{techCounts[tech.name]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )})}
      </div>
    </section>
  )
}
