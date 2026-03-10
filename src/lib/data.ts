import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { Project, Technology, Infrastructure } from '@/types'

const dataDir = path.join(process.cwd(), 'src/data')

function readJson<T>(filename: string): T {
  const raw = readFileSync(path.join(dataDir, filename), 'utf-8')
  return JSON.parse(raw) as T
}

function writeJson(filename: string, data: unknown): void {
  writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2), 'utf-8')
}

export function getProjects(): Project[] {
  return readJson<{ projects: Project[] }>('projects.json').projects
}

export function saveProjects(projects: Project[]): void {
  writeJson('projects.json', { projects })
}

export function getStack(): Technology[] {
  return readJson<{ technologies: Technology[] }>('stack.json').technologies
}

export function saveStack(technologies: Technology[]): void {
  writeJson('stack.json', { technologies })
}

export function getInfrastructure(): Infrastructure {
  return readJson<Infrastructure>('infrastructure.json')
}

export function saveInfrastructure(infra: Infrastructure): void {
  writeJson('infrastructure.json', infra)
}
