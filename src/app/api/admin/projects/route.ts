import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getProjects, saveProjects } from '@/lib/data'
import { ProjectsSchema } from '@/lib/schemas'

async function guard() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return null
}

export async function GET() {
  const denied = await guard()
  if (denied) return denied
  return NextResponse.json(getProjects())
}

export async function PUT(req: NextRequest) {
  const denied = await guard()
  if (denied) return denied

  const body = await req.json()
  const result = ProjectsSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Données invalides', details: result.error.flatten() }, { status: 400 })
  }

  saveProjects(result.data)
  return NextResponse.json({ ok: true })
}
