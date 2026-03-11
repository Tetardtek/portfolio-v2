import { rateLimit } from '@/lib/rateLimit'

const OPTIONS = { windowMs: 1000, max: 3 }

// Chaque test utilise une IP unique pour éviter que le store partagé
// entre les appels ne crée des interférences entre tests
let ipCounter = 0
function freshIp() {
  return `10.0.0.${ipCounter++}`
}

describe('rateLimit', () => {
  it('autorise la première requête', () => {
    const result = rateLimit(freshIp(), OPTIONS)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('autorise jusqu\'à max requêtes', () => {
    const ip = freshIp()
    rateLimit(ip, OPTIONS)
    rateLimit(ip, OPTIONS)
    const third = rateLimit(ip, OPTIONS)
    expect(third.allowed).toBe(true)
    expect(third.remaining).toBe(0)
  })

  it('bloque après max requêtes dépassé', () => {
    const ip = freshIp()
    rateLimit(ip, OPTIONS)
    rateLimit(ip, OPTIONS)
    rateLimit(ip, OPTIONS)
    const fourth = rateLimit(ip, OPTIONS)
    expect(fourth.allowed).toBe(false)
    expect(fourth.remaining).toBe(0)
  })

  it('remet le compteur à zéro après expiration de la fenêtre', async () => {
    const ip = freshIp()
    const shortOptions = { windowMs: 50, max: 1 }
    rateLimit(ip, shortOptions) // consomme le quota
    expect(rateLimit(ip, shortOptions).allowed).toBe(false)

    await new Promise((r) => setTimeout(r, 60)) // attend l'expiration

    expect(rateLimit(ip, shortOptions).allowed).toBe(true)
  })

  it('isole les IPs différentes', () => {
    const ip1 = freshIp()
    const ip2 = freshIp()
    rateLimit(ip1, OPTIONS)
    rateLimit(ip1, OPTIONS)
    rateLimit(ip1, OPTIONS)
    // ip1 est bloquée, ip2 ne doit pas l'être
    expect(rateLimit(ip2, OPTIONS).allowed).toBe(true)
  })

  it('retourne un resetAt dans le futur', () => {
    const before = Date.now()
    const result = rateLimit(freshIp(), OPTIONS)
    expect(result.resetAt).toBeGreaterThan(before)
  })
})
