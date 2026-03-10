export interface ProjectDescription {
  fr: string
  en: string
}

export interface Project {
  id: string
  title: string
  description: ProjectDescription
  techno: string[]
  img: string
  link: string
  github: string
  featured?: boolean
  spotlight?: boolean
}

export interface Technology {
  name: string
  img: string
  category: string
}

export interface InfraService {
  name: string
  description: { fr: string; en: string }
  url?: string
  img: string
}

export interface Infrastructure {
  description: { fr: string; en: string }
  specs: string[]
  services: InfraService[]
}

export type Theme = 'dark' | 'light'
export type Lang = 'fr' | 'en'
