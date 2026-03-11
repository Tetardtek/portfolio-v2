'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  t: {
    title: string
    subtitle: string
    name: string
    email: string
    message: string
    send: string
    sending: string
    success: string
    error: string
    ratelimit: string
  }
}

type Status = 'idle' | 'sending' | 'success' | 'error' | 'ratelimited'

export function Contact({ t }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.status === 429) setStatus('ratelimited')
      else setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full bg-surface border border-border rounded-btn px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-pink transition-colors font-sans text-sm'

  return (
    <section id="contact" className="py-24 px-6 max-w-xl mx-auto">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="font-mono text-xs text-cyan tracking-widest uppercase">{t.subtitle}</span>
        <h2 className="mt-2 text-4xl font-bold text-text">{t.title}</h2>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="glass p-8 flex flex-col gap-5"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <label className="block font-mono text-xs text-purple mb-2 uppercase tracking-wide">
            {t.name}
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Kevin Turnaco"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-purple mb-2 uppercase tracking-wide">
            {t.email}
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-purple mb-2 uppercase tracking-wide">
            {t.message}
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === 'sending' || status === 'success' || status === 'ratelimited'}
          className="w-full py-3 rounded-btn font-semibold text-white disabled:opacity-60 transition-opacity bg-gradient-vc"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {status === 'sending' ? t.sending : t.send}
        </motion.button>

        {status === 'success' && (
          <motion.p
            className="text-center text-success font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t.success}
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            className="text-center text-danger font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t.error}
          </motion.p>
        )}
        {status === 'ratelimited' && (
          <motion.p
            className="text-center text-warning font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t.ratelimit}
          </motion.p>
        )}
      </motion.form>
    </section>
  )
}
