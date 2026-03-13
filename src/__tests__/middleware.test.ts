import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

jest.mock('@/lib/auth', () => ({
  verifyToken: jest.fn(),
}))

import { verifyToken } from '@/lib/auth'
const mockVerify = verifyToken as jest.Mock

function req(path: string, token?: string) {
  const headers: HeadersInit = {}
  if (token) headers['cookie'] = `admin_token=${token}`
  return new NextRequest(`http://localhost${path}`, { headers })
}

function isNext(res: Response) {
  return res.headers.get('x-middleware-next') === '1'
}

function isRedirect(res: Response) {
  return res.status === 307
}

describe('middleware', () => {
  beforeEach(() => mockVerify.mockReset())

  describe('routes publiques — laisse passer sans vérification', () => {
    it('laisse passer /', () => {
      expect(isNext(middleware(req('/')))).toBe(true)
    })

    it('laisse passer /contact', () => {
      expect(isNext(middleware(req('/contact')))).toBe(true)
    })

    it('laisse passer /admin (page de login)', () => {
      expect(isNext(middleware(req('/admin')))).toBe(true)
    })

    it('ne consulte pas verifyToken sur une route publique', () => {
      middleware(req('/'))
      expect(mockVerify).not.toHaveBeenCalled()
    })
  })

  describe('routes protégées — sans cookie', () => {
    it('redirige /admin/dashboard sans token', () => {
      const res = middleware(req('/admin/dashboard'))
      expect(isRedirect(res)).toBe(true)
      expect(res.headers.get('location')).toBe('http://localhost/admin')
    })

    it('redirige /api/admin/projects sans token', () => {
      expect(isRedirect(middleware(req('/api/admin/projects')))).toBe(true)
    })

    it('redirige les sous-routes de /admin/dashboard', () => {
      expect(isRedirect(middleware(req('/admin/dashboard/settings')))).toBe(true)
    })
  })

  describe('routes protégées — token invalide', () => {
    it('redirige si verifyToken retourne null', () => {
      mockVerify.mockReturnValue(null)
      const res = middleware(req('/admin/dashboard', 'expired_or_bad_token'))
      expect(isRedirect(res)).toBe(true)
      expect(mockVerify).toHaveBeenCalledWith('expired_or_bad_token')
    })

    it('redirige vers /admin (pas une erreur 401)', () => {
      mockVerify.mockReturnValue(null)
      const res = middleware(req('/admin/dashboard', 'bad'))
      expect(res.headers.get('location')).toBe('http://localhost/admin')
    })
  })

  describe('routes protégées — token valide', () => {
    it('laisse passer /admin/dashboard avec token valide', () => {
      mockVerify.mockReturnValue({ sub: 'admin' })
      expect(isNext(middleware(req('/admin/dashboard', 'valid_token')))).toBe(true)
    })

    it('laisse passer /api/admin/projects avec token valide', () => {
      mockVerify.mockReturnValue({ sub: 'admin' })
      expect(isNext(middleware(req('/api/admin/projects', 'valid_token')))).toBe(true)
    })

    it('appelle verifyToken avec le bon token', () => {
      mockVerify.mockReturnValue({ sub: 'admin' })
      middleware(req('/admin/dashboard', 'my_token'))
      expect(mockVerify).toHaveBeenCalledWith('my_token')
    })
  })
})
