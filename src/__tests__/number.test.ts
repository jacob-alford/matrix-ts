import * as N from '../number'
import * as V from '../Vector'
import * as Inf from '../infix'

const { _ } = N

const AbGrp = V.getAbGroup(N.Field)(10)

const __ = Inf.getLeftModuleInfix(V.getBimodule(N.Field)(10))
const _v = Inf.getAbGrpInfix(AbGrp)

describe('number', () => {
  const rand = N.randNumber(-5_000, 5_000)
  const randV = V.randVec(10, rand)
  describe('Field laws', () => {
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', N.zero)).toStrictEqual(test)
      expect(_(N.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', N.one)).toStrictEqual(test)
      expect(_(N.one, '*', test)).toStrictEqual(test)
    })
    /** This appears to fail with large numbers */
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const d = _(a, '+', _(b, '+', c))
      const e = _(_(a, '+', b), '+', c)
      expect(d).toBeCloseTo(e)
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const d = _(_(a, '*', b), '*', c)
      const e = _(a, '*', _(b, '*', c))
      expect(d).toBeCloseTo(e)
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '+', b)).toStrictEqual(_(b, '+', a))
    })
    it('commutes with multiplication', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '*', b)).toStrictEqual(_(b, '*', a))
    })
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const d = _(a, '*', _(b, '+', c))
      const e = _(_(a, '*', b), '+', _(a, '*', c))
      const f = _(_(a, '+', b), '*', c)
      const g = _(_(a, '*', c), '+', _(b, '*', c))

      expect(d).toBeCloseTo(e)
      expect(f).toBeCloseTo(g)
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(N.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toStrictEqual(N.one)
    })
  })
  describe('Vector abelian Group laws', () => {
    it('abides additive unitor', () => {
      const test = randV()
      expect(_v(test, '+', AbGrp.empty)).toStrictEqual(test)
      expect(_v(AbGrp.empty, '+', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = randV()
      const b = randV()
      const c = randV()
      const left = _v(a, '+', _v(b, '+', c))
      const right = _v(_v(a, '+', b), '+', c)
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('commutes with addition', () => {
      const a = randV()
      const b = randV()
      const left = _v(a, '+', b)
      const right = _v(b, '+', a)
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('has an additive inverse', () => {
      const a = randV()
      expect(_v(a, '-', a)).toStrictEqual(AbGrp.empty)
    })
  })
  describe('vector space laws', () => {
    it('associates over scalar multiplication', () => {
      const a = rand()
      const b = rand()
      const p = randV()
      const left = __(a, '.*', __(b, '.*', p))
      const right = __(_(a, '*', b), '.*', p)
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('abides scalar unitor', () => {
      const p = randV()
      expect(__(N.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = rand()
      const p = randV()
      const q = randV()
      const left = __(a, '.*', _v(p, '+', q))
      const right = _v(__(a, '.*', p), '+', __(a, '.*', q))
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = rand()
      const b = rand()
      const p = randV()
      const left = __(_(a, '+', b), '.*', p)
      const right = _v(__(a, '.*', p), '+', __(b, '.*', p))
      for (const [a, b] of V.zipVectors(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
  })
  describe('Inner product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randV()
      const y = randV()
      const a = N.dot(x, y)
      const b = N.dot(y, x)
      expect(a).toBeCloseTo(b)
    })
    it('is linear in its first argument', () => {
      const a = rand()
      const b = rand()
      const x = randV()
      const y = randV()
      const z = randV()
      const left1 = __(a, '.*', x)
      const left2 = __(b, '.*', y)
      const left = N.dot(_v(left1, '+', left2), z)
      const right1 = _(a, '*', N.dot(x, z))
      const right2 = _(b, '*', N.dot(y, z))
      const right = _(right1, '+', right2)
      expect(left).toBeCloseTo(right)
    })
    it('is nonzero for nonzero x', () => {
      const x = randV()
      expect(N.dot(x, x)).not.toBeCloseTo(0)
    })
  })
})
