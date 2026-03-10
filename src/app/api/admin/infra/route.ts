import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getInfrastructure, saveInfrastructure } from '@/lib/data'

async function guard() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return null
}

export async function GET() {
  const denied = await guard()
  if (denied) return denied
  return NextResponse.json(getInfrastructure())
}

export async function PUT(req: NextRequest) {
  const denied = await guard()
  if (denied) return denied

  const infra = await req.json()
  saveInfrastructure(infra)
  return NextResponse.json({ ok: true })
}
