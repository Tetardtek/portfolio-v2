'use client'

import { motion } from 'framer-motion'
import type { Lang } from '@/types'

interface Props {
  lang: Lang
  t: {
    made_with: string
    rights: string
    download_cv: string
    nav: { projects: string; stack: string; infra: string; contact: string }
  }
}

const SOCIAL = [
  { label: 'GitHub',   href: 'https://github.com/Tetardtek',                color: 'var(--pink)'   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kevin-turnaco/',   color: 'var(--cyan)'   },
  { label: 'Discord',  href: 'https://discord.com/users/235413280103858176', color: 'var(--purple)' },
]

export function Footer({ t }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Main row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Left — brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span
              className="font-mono text-lg font-bold text-gradient"
            >
              ~/tetardtek_
            </span>
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted transition-colors"
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = s.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {s.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Center — nav */}
          <nav className="flex gap-6">
            {[
              { label: t.nav.projects, href: '#projects' },
              { label: t.nav.stack,    href: '#stack'    },
              { label: t.nav.infra,    href: '#infra'    },
              { label: t.nav.contact,  href: '#contact'  },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-muted hover:text-pink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — CV */}
          <motion.a
            href="/assets/cv/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-4 py-2 rounded-card border border-border text-muted hover:border-pink hover:text-pink transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.download_cv} ↗
          </motion.a>
        </div>

        {/* Bottom — copyright */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-mono text-xs text-muted">
            © {year} Kevin Turnaco — {t.rights}
          </p>
          <p className="font-mono text-xs text-muted">
            {t.made_with}
          </p>
        </div>
      </div>
    </footer>
  )
}
