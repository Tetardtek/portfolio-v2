'use client'

import { motion } from 'framer-motion'

interface Props {
  t: {
    role: string
    tagline: string
    cta_projects: string
    cta_contact: string
  }
}

const KEYWORDS = ['code', 'DevOps', 'Linux', 'opportunité', 'opportunity']

function highlightTagline(text: string) {
  const parts = text.split(new RegExp(`(${KEYWORDS.join('|')})`, 'g'))
  return parts.map((part, i) =>
    KEYWORDS.includes(part) ? (
      <span key={i} style={{ WebkitTextFillColor: 'var(--text)', fontWeight: 700, textShadow: '0 0 14px rgba(255,121,198,0.7)' }}>
        {part}
      </span>
    ) : part
  )
}

const SOCIAL = [
  { label: 'GitHub',   href: 'https://github.com/Tetardtek',                      color: 'var(--pink)'   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kevin-turnaco/',         color: 'var(--cyan)'   },
  { label: 'Discord',  href: 'https://discord.com/users/235413280103858176',       color: 'var(--purple)' },
]

export function Hero({ t }: Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden -mt-4"
    >
      {/* Background glow blobs */}
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--pink), var(--purple))' }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 max-w-2xl -mt-16"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Pretitle */}
        <motion.span
          className="font-mono text-sm text-cyan tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Kevin Turnaco
        </motion.span>

        {/* Name */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="text-gradient">
            Tetardtek
          </span>
        </motion.h1>

        {/* Role */}
        <motion.p
          className="font-mono text-base md:text-xl font-bold text-gradient-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t.role}
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="text-base md:text-lg leading-relaxed whitespace-pre-line max-w-md font-medium text-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          {highlightTagline(t.tagline)}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex gap-4 mt-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-card font-semibold text-white transition-opacity hover:opacity-90 bg-gradient-vc"
          >
            {t.cta_projects}
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-card font-semibold border border-border text-text hover:border-pink hover:text-pink transition-colors"
          >
            {t.cta_contact}
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex gap-3 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {SOCIAL.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-4 py-1.5 font-mono text-sm transition-colors text-muted"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {s.label}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <span className="font-mono text-xs">scroll</span>
        <span className="text-lg">↓</span>
      </motion.div>
    </section>
  )
}
