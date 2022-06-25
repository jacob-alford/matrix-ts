import { tuple } from 'fp-ts/function'

import * as C from '../complex'
import * as N from '../number'
import * as Poly from '../Polynomial'
import * as Inf from '../infix'

const _ = Inf.getEuclideanRingInfix(Poly.getEuclidianRing(N.Eq, N.Field))
const _n = N._

const __ = Inf.getLeftModuleInfix(Poly.getBimodule(N.Eq, N.Field))

const zero = Poly.zero<number>()
const one = Poly.one(N.Field)

const zip = Poly.preservingZipWith<number, [number, number]>(tuple, 0)

describe('polynomial', () => {
  const randN = N.randNumber(-10_000, 10_000)
  const randC = C.randComplex(-10_000, 10_000)
  const rand = Poly.randPolynomial(10, randN)
  const randCP = Poly.randPolynomial(10, randC)
  describe('EuclidianRing laws', () => {
    const _ = Inf.getEuclideanRingInfix(Poly.getEuclidianRing(N.Eq, N.Field))
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', zero)).toStrictEqual(test)
      expect(_(zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', one)).toStrictEqual(test)
      expect(_(one, '*', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const left = _(a, '+', _(b, '+', c))
      const right = _(_(a, '+', b), '+', c)
      for (const [a, b] of zip(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const left = _(a, '*', _(b, '*', c))
      const right = _(_(a, '*', b), '*', c)
      for (const [a, b] of zip(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      const left = _(a, '+', b)
      const right = _(b, '+', a)
      for (const [a, b] of zip(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('commutes with multiplication', () => {
      const a = rand()
      const b = rand()
      const left = _(a, '*', b)
      const right = _(b, '*', a)
      for (const [a, b] of zip(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const l1 = _(a, '*', _(b, '+', c))
      const r1 = _(_(a, '*', b), '+', _(a, '*', c))
      const l2 = _(_(a, '+', b), '*', c)
      const r2 = _(_(a, '*', c), '+', _(b, '*', c))
      for (const [a, b] of zip(l1, r1)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of zip(l2, r2)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toStrictEqual(one)
    })
  })
  describe('Vector Space laws', () => {
    it('associates over scalar multiplication', () => {
      const a = randN()
      const b = randN()
      const p = rand()
      const left = __(a, '.*', __(b, '.*', p))
      const right = __(_n(a, '*', b), '.*', p)
      for (const [a, b] of zip(left, right)) {
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
      for (const [a, b] of zip(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = randN()
      const b = randN()
      const p = rand()
      const left = __(_n(a, '+', b), '.*', p)
      const right = _(__(a, '.*', p), '+', __(b, '.*', p))
      for (const [a, b] of zip(left, right)) {
        expect(a).toBeCloseTo(b)
      }
    })
  })
  describe('Inner Product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randCP()
      const y = randCP()
      const { Re: a1, Im: b1 } = C.polynomialInnerProduct(x, y)
      const { Re: a2, Im: b2 } = C.conj(C.polynomialInnerProduct(y, x))
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
      const left = N.polynomialInnerProduct(_(left1, '+', left2), z)
      const right1 = _n(a, '*', N.polynomialInnerProduct(x, z))
      const right2 = _n(b, '*', N.polynomialInnerProduct(y, z))
      const right = _n(right1, '+', right2)
      expect(left).toBeCloseTo(right)
    })
    it('is nonzero for nonzero x', () => {
      const x = rand()
      expect(N.polynomialInnerProduct(x, x)).not.toBeCloseTo(0)
    })
  })
})
