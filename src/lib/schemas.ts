import { z } from 'zod'

const BilingualSchema = z.object({
  fr: z.string(),
  en: z.string(),
})

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: BilingualSchema,
  techno: z.array(z.string()),
  img: z.string(),
  link: z.string(),
  github: z.string(),
  featured: z.boolean().optional(),
  spotlight: z.boolean().optional(),
})

export const ProjectsSchema = z.array(ProjectSchema)

export const TechnologySchema = z.object({
  name: z.string().min(1),
  img: z.string(),
  category: z.string().min(1),
})

export const StackSchema = z.array(TechnologySchema)

export const InfraServiceSchema = z.object({
  name: z.string().min(1),
  description: BilingualSchema,
  url: z.string().optional(),
  img: z.string(),
})

export const InfrastructureSchema = z.object({
  description: BilingualSchema,
  specs: z.array(z.string()),
  services: z.array(InfraServiceSchema),
})

export const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
})
