import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mail'
import { ContactSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
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
