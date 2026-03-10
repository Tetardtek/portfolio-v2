'use client'

import { useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Stack } from '@/components/sections/Stack'
import { Infrastructure } from '@/components/sections/Infrastructure'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import type { Lang } from '@/types'

import projectsData from '@/data/projects.json'
import stackData from '@/data/stack.json'
import infraData from '@/data/infrastructure.json'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'
import type { Technology } from '@/types'

const translations = { fr, en }

const techCounts = (projectsData.projects as import('@/types').Project[]).reduce<Record<string, number>>(
  (acc, p) => { p.techno.forEach((name) => { acc[name] = (acc[name] ?? 0) + 1 }); return acc },
  {}
)

export default function Home() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = translations[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} nav={t.nav} />

      <main>
        <Hero t={t.hero} />
        <Projects projects={projectsData.projects as import('@/types').Project[]} lang={lang} stack={stackData.technologies as Technology[]} t={t.projects} />
        <Stack stack={stackData.technologies as Technology[]} techCounts={techCounts} t={t.stack} />
        <Infrastructure infra={infraData as import('@/types').Infrastructure} stack={stackData.technologies as Technology[]} lang={lang} t={t.infra} />
        <Contact t={t.contact} />
      </main>

      <Footer lang={lang} t={t.footer} />
    </>
  )
}
