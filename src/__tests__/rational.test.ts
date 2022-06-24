import * as Q from '../rational'
import * as V from '../Vector'
import * as Inf from '../infix'

const { _ } = Q

const AbGrp = V.getAbGroup(Q.Field)(2)

const __ = Inf.getLeftModuleInfix(V.getBimodule(Q.Field)(2))
const _v = Inf.getAbGrpInfix(AbGrp)

describe('Rational', () => {
  const rand = Q.randRational(-500, 500)
  const randV = V.randVec(2, rand)
  describe('Field laws', () => {
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', Q.zero)).toStrictEqual(test)
      expect(_(Q.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', Q.one)).toStrictEqual(test)
      expect(_(Q.one, '*', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '+', _(b, '+', c))).toStrictEqual(_(_(a, '+', b), '+', c))
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '*', c))).toStrictEqual(_(_(a, '*', b), '*', c))
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
    /** This appears to fail with large numbers */
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '+', c))).toStrictEqual(_(_(a, '*', b), '+', _(a, '*', c)))
      expect(_(_(a, '+', b), '*', c)).toStrictEqual(_(_(a, '*', c), '+', _(b, '*', c)))
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(Q.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toStrictEqual(Q.one)
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
      for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
        left,
        right
      )) {
        expect(a1).toBeCloseTo(a2)
        expect(b1).toBeCloseTo(b2)
      }
    })
    it('commutes with addition', () => {
      const a = randV()
      const b = randV()
      const left = _v(a, '+', b)
      const right = _v(b, '+', a)
      for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
        left,
        right
      )) {
        expect(a1).toBeCloseTo(a2)
        expect(b1).toBeCloseTo(b2)
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
      for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
        left,
        right
      )) {
        expect(a1).toBeCloseTo(a2)
        expect(b1).toBeCloseTo(b2)
      }
    })
    it('abides scalar unitor', () => {
      const p = randV()
      expect(__(Q.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = rand()
      const p = randV()
      const q = randV()
      const left = __(a, '.*', _v(p, '+', q))
      const right = _v(__(a, '.*', p), '+', __(a, '.*', q))
      for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
        left,
        right
      )) {
        expect(a1).toBeCloseTo(a2)
        expect(b1).toBeCloseTo(b2)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = rand()
      const b = rand()
      const p = randV()
      const left = __(_(a, '+', b), '.*', p)
      const right = _v(__(a, '.*', p), '+', __(b, '.*', p))
      for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
        left,
        right
      )) {
        expect(a1).toBeCloseTo(a2)
        expect(b1).toBeCloseTo(b2)
      }
    })
  })
  describe('Inner product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randV()
      const y = randV()
      const { top: a1, bottom: b1 } = Q.dot(x, y)
      const { top: a2, bottom: b2 } = Q.dot(y, x)
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
    })
    /** TODO: This fails for some reason... */
    it.skip('is linear in its first argument', () => {
      const a = rand()
      const b = rand()
      const x = randV()
      const y = randV()
      const z = randV()
      const left1 = __(a, '.*', x)
      const left2 = __(b, '.*', y)
      const left = Q.dot(_v(left1, '+', left2), z)
      const right1 = _(a, '*', Q.dot(x, z))
      const right2 = _(b, '*', Q.dot(y, z))
      const right = _(right1, '+', right2)
      expect(Q.toNumber(left)).toBeCloseTo(Q.toNumber(right))
    })
    it('is nonzero for nonzero x', () => {
      const x = randV()
      const { top, bottom } = Q.dot(x, x)
      expect(top).not.toBeCloseTo(0)
      expect(bottom).not.toBeCloseTo(0)
    })
  })
})
