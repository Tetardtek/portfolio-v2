'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Project, Lang } from '@/types'

interface Props {
  project: Project
  demoLabel: string
  codeLabel: string
  lang: Lang
}

export function ProjectCard({ project, demoLabel, codeLabel, lang }: Props) {
  return (
    <motion.article
      className="glass flex flex-col overflow-hidden group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-high">
        <Image
          src={project.img}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        <h3 className="font-mono text-pink font-semibold text-lg leading-tight">
          {project.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed flex-1">
          {project.description[lang]}
        </p>

        {/* Techno badges */}
        <div className="flex flex-wrap gap-1.5">
          {project.techno.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-xs font-mono bg-high border border-border text-cyan"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-1">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-btn bg-pink text-base font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            {demoLabel}
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-btn border border-border text-muted hover:border-purple hover:text-purple text-sm transition-colors"
          >
            {codeLabel}
          </a>
        </div>
      </div>
    </motion.article>
  )
}
