import { NextRequest, NextResponse } from 'next/server'
import { guard } from '@/lib/auth'
import { getStack, saveStack } from '@/lib/data'
import { StackSchema } from '@/lib/schemas'

export async function GET() {
  const denied = await guard()
  if (denied) return denied
  return NextResponse.json(getStack())
}

export async function PUT(req: NextRequest) {
  const denied = await guard()
  if (denied) return denied

  const body = await req.json()
  const result = StackSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Données invalides', details: result.error.flatten() }, { status: 400 })
  }

  saveStack(result.data)
  return NextResponse.json({ ok: true })
}
