'use client'

import { useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Stack } from '@/components/sections/Stack'
import { Infrastructure } from '@/components/sections/Infrastructure'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import type { Lang, Project, Technology, Infrastructure as InfraType } from '@/types'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

const translations = { fr, en }

interface Props {
  projects: Project[]
  stack: Technology[]
  infra: InfraType
  techCounts: Record<string, number>
}

export default function HomeClient({ projects, stack, infra, techCounts }: Props) {
  const [lang, setLang] = useState<Lang>('fr')
  const t = translations[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} nav={t.nav} />

      <main>
        <Hero t={t.hero} />
        <Projects projects={projects} lang={lang} stack={stack} t={t.projects} />
        <Stack stack={stack} techCounts={techCounts} t={t.stack} />
        <Infrastructure infra={infra} stack={stack} lang={lang} t={t.infra} />
        <Contact t={t.contact} />
      </main>

      <Footer lang={lang} t={t.footer} />
      <BackToTop />
    </>
  )
}
