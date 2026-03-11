import {
  ContactSchema,
  ProjectSchema,
  ProjectsSchema,
  TechnologySchema,
  StackSchema,
  InfrastructureSchema,
} from '@/lib/schemas'

// ── ContactSchema ────────────────────────────────────────────────────────────

describe('ContactSchema', () => {
  const valid = { name: 'Kevin', email: 'kevin@example.com', message: 'Bonjour !' }

  it('accepte un payload valide', () => {
    expect(ContactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejette un email invalide', () => {
    expect(ContactSchema.safeParse({ ...valid, email: 'pas-un-email' }).success).toBe(false)
  })

  it('rejette un nom vide', () => {
    expect(ContactSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('rejette un message vide', () => {
    expect(ContactSchema.safeParse({ ...valid, message: '' }).success).toBe(false)
  })

  it('rejette un message trop long (> 5000 chars)', () => {
    expect(ContactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) }).success).toBe(false)
  })

  it('rejette un payload sans champs', () => {
    expect(ContactSchema.safeParse({}).success).toBe(false)
  })
})

// ── ProjectSchema ────────────────────────────────────────────────────────────

describe('ProjectSchema', () => {
  const valid = {
    id: 'project-1',
    title: 'Mon projet',
    description: { fr: 'Description FR', en: 'Description EN' },
    techno: ['React', 'TypeScript'],
    img: '/img/projet.png',
    link: 'https://exemple.com',
    github: 'https://github.com/foo/bar',
  }

  it('accepte un projet valide', () => {
    expect(ProjectSchema.safeParse(valid).success).toBe(true)
  })

  it('accepte les champs optionnels featured et spotlight', () => {
    expect(ProjectSchema.safeParse({ ...valid, featured: true, spotlight: false }).success).toBe(true)
  })

  it('rejette un id vide', () => {
    expect(ProjectSchema.safeParse({ ...valid, id: '' }).success).toBe(false)
  })

  it('rejette un titre vide', () => {
    expect(ProjectSchema.safeParse({ ...valid, title: '' }).success).toBe(false)
  })

  it('rejette une description sans champ fr', () => {
    expect(ProjectSchema.safeParse({ ...valid, description: { en: 'EN only' } }).success).toBe(false)
  })

  it('rejette techno non-array', () => {
    expect(ProjectSchema.safeParse({ ...valid, techno: 'React' }).success).toBe(false)
  })
})

describe('ProjectsSchema', () => {
  it('accepte un tableau vide', () => {
    expect(ProjectsSchema.safeParse([]).success).toBe(true)
  })

  it('rejette si un élément du tableau est invalide', () => {
    expect(ProjectsSchema.safeParse([{ id: '' }]).success).toBe(false)
  })
})

// ── TechnologySchema ─────────────────────────────────────────────────────────

describe('TechnologySchema', () => {
  const valid = { name: 'React', img: 'https://cdn.example.com/react.svg', category: 'framework' }

  it('accepte une techno valide', () => {
    expect(TechnologySchema.safeParse(valid).success).toBe(true)
  })

  it('rejette un nom vide', () => {
    expect(TechnologySchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('rejette une catégorie vide', () => {
    expect(TechnologySchema.safeParse({ ...valid, category: '' }).success).toBe(false)
  })
})

describe('StackSchema', () => {
  it('accepte un tableau vide', () => {
    expect(StackSchema.safeParse([]).success).toBe(true)
  })
})

// ── InfrastructureSchema ─────────────────────────────────────────────────────

describe('InfrastructureSchema', () => {
  const valid = {
    description: { fr: 'Mon VPS', en: 'My VPS' },
    specs: ['Docker', 'nginx'],
    services: [
      {
        name: 'n8n',
        description: { fr: 'Automatisation', en: 'Automation' },
        img: 'https://cdn.example.com/n8n.svg',
        url: 'https://n8n.tetardtek.com',
      },
    ],
  }

  it('accepte une infra valide', () => {
    expect(InfrastructureSchema.safeParse(valid).success).toBe(true)
  })

  it('accepte un service sans url (optionnel)', () => {
    const service = { name: 'Affine', description: { fr: 'Notes', en: 'Notes' }, img: '' }
    expect(InfrastructureSchema.safeParse({ ...valid, services: [service] }).success).toBe(true)
  })

  it('rejette specs non-array', () => {
    expect(InfrastructureSchema.safeParse({ ...valid, specs: 'Docker' }).success).toBe(false)
  })

  it('rejette un service sans nom', () => {
    const badService = { name: '', description: { fr: '', en: '' }, img: '' }
    expect(InfrastructureSchema.safeParse({ ...valid, services: [badService] }).success).toBe(false)
  })
})
