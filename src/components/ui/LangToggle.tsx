'use client'

import { motion } from 'framer-motion'
import type { Lang } from '@/types'

interface Props {
  lang: Lang
  onToggle: (lang: Lang) => void
}

export function LangToggle({ lang, onToggle }: Props) {
  return (
    <motion.button
      onClick={() => onToggle(lang === 'fr' ? 'en' : 'fr')}
      className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] font-mono text-sm transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle language"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </motion.button>
  )
}
