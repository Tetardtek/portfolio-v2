'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Infrastructure as InfraType, Technology, Lang } from '@/types'
import { TechBadge } from '@/components/ui/TechBadge'

interface Props {
  infra: InfraType
  stack: Technology[]
  lang: Lang
  t: {
    title: string
    subtitle: string
  }
}

export function Infrastructure({ infra, stack, lang, t }: Props) {
  return (
    <section id="infra" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="font-mono text-xs text-cyan tracking-widest uppercase">{t.subtitle}</span>
        <h2 className="mt-2 text-4xl font-bold text-text">{t.title}</h2>
      </motion.div>

      {/* VPS description card */}
      <motion.div
        className="glass p-6 mb-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-pink text-lg">⬡</span>
          <h3 className="font-mono text-pink font-semibold">VPS Linux</h3>
          <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-mono bg-high border border-success text-success">
            ● production
          </span>
        </div>
        <p className="text-muted text-sm leading-relaxed mb-4">{infra.description[lang]}</p>

        {/* Specs — badges liés au stack */}
        <div className="flex flex-wrap gap-2">
          {infra.specs.map((specName) => (
            <TechBadge key={specName} name={specName} stack={stack} />
          ))}
        </div>
      </motion.div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infra.services.map((service, i) => {
          const isLink = !!service.url
          const Card = (
            <motion.div
              className={`glass p-5 flex gap-4 items-start group ${isLink ? 'cursor-pointer' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={isLink ? { y: -3, boxShadow: '0 0 16px rgba(231,156,254,0.2)', borderColor: 'rgba(231,156,254,0.4)' } : { y: -3 }}
            >
              <div className="relative w-8 h-8 shrink-0 mt-0.5">
                {service.img
                  ? <Image src={service.img} alt={service.name} fill sizes="32px" className="object-contain" />
                  : <span className="w-8 h-8 flex items-center justify-center font-mono text-border text-xs">?</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-mono text-purple font-semibold text-sm">{service.name}</h4>
                  {isLink && (
                    <span className="font-mono text-xs text-border group-hover:text-purple transition-colors">↗</span>
                  )}
                </div>
                <p className="text-muted text-xs leading-relaxed">{service.description[lang]}</p>
              </div>
            </motion.div>
          )

          return isLink ? (
            <a key={service.name} href={service.url} target="_blank" rel="noopener noreferrer">{Card}</a>
          ) : (
            <div key={service.name}>{Card}</div>
          )
        })}
      </div>
    </section>
  )
}
