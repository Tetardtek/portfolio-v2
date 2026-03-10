import type { Lang } from '@/types'

interface Props {
  lang: Lang
  t: {
    made_with: string
    rights: string
  }
}

export function Footer({ t }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] py-8 px-6 text-center">
      <p className="font-mono text-xs text-[var(--text-muted)]">
        {t.made_with} ·{' '}
        <a href="mailto:contact@tetardtek.com" className="hover:text-[var(--pink)] transition-colors">
          contact@tetardtek.com
        </a>
      </p>
      <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
        © {year} Kevin Turnaco — {t.rights}
      </p>
    </footer>
  )
}
