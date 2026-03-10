import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, buildAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const hashB64 = process.env.ADMIN_PASSWORD_HASH
  if (!hashB64) return NextResponse.json({ error: 'Non configuré' }, { status: 500 })

  const hash = Buffer.from(hashB64, 'base64').toString('utf-8')
  const valid = await bcrypt.compare(password, hash)
  if (!valid) return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })

  const token = signToken({ sub: 'admin' })

  return NextResponse.json(
    { ok: true },
    { headers: { 'Set-Cookie': buildAuthCookie(token) } }
  )
}
