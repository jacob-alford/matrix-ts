import * as C from '../complex'
import * as N from '../number'
import * as V from '../Vector'
import * as Inf from '../infix'

const AbGrp = V.getAbGroup(N.Field)(10)

const _ = Inf.getAbGrpInfix(AbGrp)
const _n = N._

const __ = Inf.getLeftModuleInfix(V.getBimodule(N.Field)(10))

const zero = AbGrp.empty

describe('vector', () => {
  const randN = N.randNumber(-10_000, 10_000)
  const randC = C.randComplex(-10_000, 10_000)
  const rand = V.randVec(10, randN)
  const randCP = V.randVec(10, randC)
  describe('Abelian Group laws', () => {
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', zero)).toStrictEqual(test)
      expect(_(zero, '+', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const left = _(a, '+', _(b, '+', c))
      const right = _(_(a, '+', b), '+', c)
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      const left = _(a, '+', b)
      const right = _(b, '+', a)
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(zero)
    })
  })
  describe('vector space laws', () => {
    it('associates over scalar multiplication', () => {
      const a = randN()
      const b = randN()
      const p = rand()
      const left = __(a, '.*', __(b, '.*', p))
      const right = __(_n(a, '*', b), '.*', p)
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('abides scalar unitor', () => {
      const p = rand()
      expect(__(N.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = randN()
      const p = rand()
      const q = rand()
      const left = __(a, '.*', _(p, '+', q))
      const right = _(__(a, '.*', p), '+', __(a, '.*', q))
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = randN()
      const b = randN()
      const p = rand()
      const left = __(_n(a, '+', b), '.*', p)
      const right = _(__(a, '.*', p), '+', __(b, '.*', p))
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
  })
  describe('Inner product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randCP()
      const y = randCP()
      const { Re: a1, Im: b1 } = C.dot(x, y)
      const { Re: a2, Im: b2 } = C.conj(C.dot(y, x))
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
    })
    it('is linear in its first argument', () => {
      const a = randN()
      const b = randN()
      const x = rand()
      const y = rand()
      const z = rand()
      const left1 = __(a, '.*', x)
      const left2 = __(b, '.*', y)
      const left = N.dot(_(left1, '+', left2), z)
      const right1 = _n(a, '*', N.dot(x, z))
      const right2 = _n(b, '*', N.dot(y, z))
      const right = _n(right1, '+', right2)
      expect(left).toBeCloseTo(right)
    })
    it('is nonzero for nonzero x', () => {
      const x = rand()
      expect(N.dot(x, x)).not.toBeCloseTo(0)
    })
  })
})
