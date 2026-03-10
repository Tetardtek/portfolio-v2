import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getStack, saveStack } from '@/lib/data'

async function guard() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return null
}

export async function GET() {
  const denied = await guard()
  if (denied) return denied
  return NextResponse.json(getStack())
}

export async function PUT(req: NextRequest) {
  const denied = await guard()
  if (denied) return denied

  const stack = await req.json()
  saveStack(stack)
  return NextResponse.json({ ok: true })
}
