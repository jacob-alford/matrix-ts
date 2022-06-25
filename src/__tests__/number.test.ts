import { tuple } from 'fp-ts/function'

import * as N from '../number'
import * as V from '../Vector'
import * as M from '../Matrix'
import * as Inf from '../infix'
import * as Poly from '../Polynomial'

const { _ } = N

const AbGrp = V.getAdditiveAbelianGroup(N.Field)(10)
const AbGrpM = M.getAdditiveAbelianGroup(N.Field)(10, 10)
const AbGrpP = N.PolynomialEuclidianRing

const __ = Inf.getLeftModuleInfix(V.getBimodule(N.Field)(10))
const __p = Inf.getLeftModuleInfix(N.PolynomialBimodule)
const _p = Inf.getEuclideanRingInfix(N.PolynomialEuclidianRing)
const _v = Inf.getAbGrpInfix(AbGrp)
const _m = Inf.getAbGrpInfix(AbGrpM)

const zipP = Poly.preservingZipWith<number, [number, number]>(tuple, 0)

describe('number', () => {
  const rand = N.randNumber(-5_000, 5_000)
  const randV = V.randVec(10, rand)
  const randM = M.randMatrix(10, 10, rand)
  const randP = Poly.randPolynomial(10, rand)
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
  describe('Vector Abelian Group laws', () => {
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
  describe('Matrix Abelian Group laws', () => {
    it('abides additive unitor', () => {
      const test = randM()
      expect(_m(test, '+', AbGrpM.empty)).toStrictEqual(test)
      expect(_m(AbGrpM.empty, '+', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = randM()
      const b = randM()
      const c = randM()
      const left = _m(a, '+', _m(b, '+', c))
      const right = _m(_m(a, '+', b), '+', c)
      for (const [va, vb] of V.zipVectors(left, right)) {
        for (const [a, b] of V.zipVectors(va, vb)) {
          expect(a).toBeCloseTo(b)
        }
      }
    })
    it('commutes with addition', () => {
      const a = randM()
      const b = randM()
      const left = _m(a, '+', b)
      const right = _m(b, '+', a)
      for (const [va, vb] of V.zipVectors(left, right)) {
        for (const [a, b] of V.zipVectors(va, vb)) {
          expect(a).toBeCloseTo(b)
        }
      }
    })
    it('has an additive inverse', () => {
      const a = randM()
      expect(_m(a, '-', a)).toStrictEqual(AbGrpM.empty)
    })
  })
  describe('Vector Space laws', () => {
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
  describe('Inner Product laws', () => {
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
  describe('Polynomial EuclidianRing laws', () => {
    it('abides additive unitor', () => {
      const test = randP()
      expect(_p(test, '+', AbGrpP.zero)).toStrictEqual(test)
      expect(_p(AbGrpP.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = randP()
      expect(_p(test, '*', AbGrpP.one)).toStrictEqual(test)
      expect(_p(AbGrpP.one, '*', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = randP()
      const b = randP()
      const c = randP()
      const left = _p(a, '+', _p(b, '+', c))
      const right = _p(_p(a, '+', b), '+', c)
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = randP()
      const b = randP()
      const c = randP()
      const left = _p(a, '*', _p(b, '*', c))
      const right = _p(_p(a, '*', b), '*', c)
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('commutes with addition', () => {
      const a = randP()
      const b = randP()
      const left = _p(a, '+', b)
      const right = _p(b, '+', a)
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('commutes with multiplication', () => {
      const a = randP()
      const b = randP()
      const left = _p(a, '*', b)
      const right = _p(b, '*', a)
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('distributes multiplication over addition', () => {
      const a = randP()
      const b = randP()
      const c = randP()
      const l1 = _p(a, '*', _p(b, '+', c))
      const r1 = _p(_p(a, '*', b), '+', _p(a, '*', c))
      const l2 = _p(_p(a, '+', b), '*', c)
      const r2 = _p(_p(a, '*', c), '+', _p(b, '*', c))
      for (const [a, b] of zipP(l1, r1)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of zipP(l2, r2)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('has an additive inverse', () => {
      const a = randP()
      expect(_p(a, '-', a)).toStrictEqual(AbGrpP.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = randP()
      expect(_p(a, '/', a)).toStrictEqual(AbGrpP.one)
    })
  })
  describe('Polynomial Vector Space laws', () => {
    it('associates over scalar multiplication', () => {
      const a = rand()
      const b = rand()
      const p = randP()
      const left = __p(a, '.*', __p(b, '.*', p))
      const right = __p(_(a, '*', b), '.*', p)
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('abides scalar unitor', () => {
      const p = randP()
      expect(__p(N.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = rand()
      const p = randP()
      const q = randP()
      const left = __p(a, '.*', _p(p, '+', q))
      const right = _p(__p(a, '.*', p), '+', __p(a, '.*', q))
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = rand()
      const b = rand()
      const p = randP()
      const left = __p(_(a, '+', b), '.*', p)
      const right = _p(__p(a, '.*', p), '+', __p(b, '.*', p))
      for (const [a, b] of zipP(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
  })
  describe('Polynomial Inner Product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randP()
      const y = randP()
      const a = N.polynomialInnerProduct(x, y)
      const b = N.polynomialInnerProduct(y, x)
      expect(a).toBeCloseTo(b)
    })
    it('is linear in its first argument', () => {
      const a = rand()
      const b = rand()
      const x = randP()
      const y = randP()
      const z = randP()
      const left1 = __p(a, '.*', x)
      const left2 = __p(b, '.*', y)
      const left = N.polynomialInnerProduct(_p(left1, '+', left2), z)
      const right1 = _(a, '*', N.polynomialInnerProduct(x, z))
      const right2 = _(b, '*', N.polynomialInnerProduct(y, z))
      const right = _(right1, '+', right2)
      expect(left).toBeCloseTo(right)
    })
    it('is nonzero for nonzero x', () => {
      const x = randP()
      expect(N.polynomialInnerProduct(x, x)).not.toBeCloseTo(0)
    })
  })
})
