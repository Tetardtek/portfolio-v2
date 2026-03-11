import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mail'
import { rateLimit } from '@/lib/rateLimit'
import { ContactSchema } from '@/lib/schemas'

// 5 messages max par IP toutes les 15 minutes
const LIMIT = { windowMs: 15 * 60 * 1000, max: 5 }

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed, resetAt } = rateLimit(ip, LIMIT)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés. Réessayez dans quelques minutes.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) },
      }
    )
  }

  try {
    const body = await req.json()
    const result = ContactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Champs invalides' }, { status: 400 })
    }

    await sendContactEmail(result.data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
