'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LangToggle } from '@/components/ui/LangToggle'
import type { Lang } from '@/types'

interface Props {
  lang: Lang
  onLangChange: (l: Lang) => void
  nav: {
    projects: string
    stack: string
    infra: string
    contact: string
  }
}

const SECTIONS = ['projects', 'stack', 'infra', 'contact']

export function Navbar({ lang, onLangChange, nav }: Props) {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.92])
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])

  const [theme, setTheme] = useState<string>('dark')
  useEffect(() => {
    const update = () => setTheme(document.documentElement.getAttribute('data-theme') ?? 'dark')
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const isDark = theme !== 'light'
  const navBg     = isDark ? '38, 21, 55'   : '245, 240, 250'
  const navBorder = isDark ? '92, 73, 108'  : '184, 168, 204'
  const bg          = useMotionTemplate`rgba(${navBg}, ${bgOpacity})`
  const borderColor = useMotionTemplate`rgba(${navBorder}, ${borderOpacity})`

  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40
      if (atBottom) {
        setActive(SECTIONS[SECTIONS.length - 1])
        return
      }
      const scrollPos = window.scrollY + 80
      let current: string | null = null
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) current = id
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Verrouille le scroll body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { label: nav.projects, href: '#projects', id: 'projects' },
    { label: nav.stack,    href: '#stack',    id: 'stack'    },
    { label: nav.infra,    href: '#infra',    id: 'infra'    },
    { label: nav.contact,  href: '#contact',  id: 'contact'  },
  ]

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: bg, borderBottom: '1px solid', borderColor, backdropFilter: 'blur(14px)' }}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">

          {/* Logo */}
          <a
            href="#hero"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-0.5 font-mono font-bold text-pink hover:opacity-80 transition-opacity"
          >
            ~/tetardtek
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, repeatType: 'reverse' }}
            >
              _
            </motion.span>
          </a>

          {/* Links desktop */}
          <ul className="hidden md:flex gap-1">
            {links.map((l) => {
              const isActive = active === l.id
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="relative flex items-center px-3 py-1.5 font-mono text-sm transition-colors"
                    style={{ color: isActive ? 'var(--pink)' : 'var(--text-muted)' }}
                  >
                    <span className="relative z-10">{l.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-pink to-purple"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LangToggle lang={lang} onToggle={onLangChange} />
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 ml-1"
            >
              <motion.span
                className="block h-px w-5 bg-pink origin-center"
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block h-px w-5 bg-pink"
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px w-5 bg-pink origin-center"
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: isDark ? 'rgba(20, 10, 35, 0.6)' : 'rgba(200, 190, 220, 0.5)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 z-40 md:hidden"
              style={{ background: isDark ? 'rgba(38, 21, 55, 0.97)' : 'rgba(245, 240, 250, 0.97)', borderBottom: `1px solid rgba(${navBorder}, 0.8)`, backdropFilter: 'blur(20px)' }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ul className="flex flex-col px-6 py-4 gap-1">
                {links.map((l, i) => {
                  const isActive = active === l.id
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-btn font-mono text-base transition-colors"
                        style={{ color: isActive ? 'var(--pink)' : 'var(--text-muted)' }}
                      >
                        <span>{l.label}</span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)' }}
                          />
                        )}
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
