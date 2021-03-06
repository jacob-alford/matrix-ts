import { tuple } from 'fp-ts/function'

import * as C from '../src/complex'
import * as V from '../src/Vector'
import * as M from '../src/Matrix'
import * as Inf from '../src/infix'
import * as Poly from '../src/Polynomial'

const { _ } = C

const AbGrp = V.getAdditiveAbelianGroup(C.Field)(10)
const AbGrpM = M.getAdditiveAbelianGroup(C.Field)(10, 10)
const AbGrpP = C.PolynomialEuclidianRing

const __ = Inf.getLeftModuleInfix(V.getBimodule(C.Field)(10))
const _v = Inf.getAbGrpInfix(AbGrp)
const _m = Inf.getAbGrpInfix(AbGrpM)

const __p = Inf.getLeftModuleInfix(C.PolynomialBimodule)
const _p = Inf.getEuclideanRingInfix(C.PolynomialEuclidianRing)

const zipP = Poly.preservingZipWith<C.Complex, [C.Complex, C.Complex]>(tuple, C.zero)

describe('Complex', () => {
  const rand = C.randComplex(-5_000, 5_000)
  const randV = V.randVec(10, rand)
  const randM = M.randMatrix(10, 10, rand)
  const randP = Poly.randPolynomial(10, rand)
  describe('Field laws', () => {
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', C.zero)).toStrictEqual(test)
      expect(_(C.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', C.one)).toStrictEqual(test)
      expect(_(C.one, '*', test)).toStrictEqual(test)
    })
    /** This appears to fail with large numbers */
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { Re: Re1, Im: Im1 } = _(a, '+', _(b, '+', c))
      const { Re: Re2, Im: Im2 } = _(_(a, '+', b), '+', c)
      expect(Re1).toBeCloseTo(Re2)
      expect(Im1).toBeCloseTo(Im2)
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { Re: Re1, Im: Im1 } = _(_(a, '*', b), '*', c)
      const { Re: Re2, Im: Im2 } = _(a, '*', _(b, '*', c))
      expect(Re1).toBeCloseTo(Re2)
      expect(Im1).toBeCloseTo(Im2)
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
      const { Re: Re1l, Im: Im1l } = _(a, '*', _(b, '+', c))
      const { Re: Re2l, Im: Im2l } = _(_(a, '*', b), '+', _(a, '*', c))
      const { Re: Re1r, Im: Im1r } = _(_(a, '+', b), '*', c)
      const { Re: Re2r, Im: Im2r } = _(_(a, '*', c), '+', _(b, '*', c))

      expect(Re1l).toBeCloseTo(Re2l)
      expect(Im1l).toBeCloseTo(Im2l)
      expect(Re1r).toBeCloseTo(Re2r)
      expect(Im1r).toBeCloseTo(Im2r)
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(C.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toStrictEqual(C.one)
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
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('commutes with addition', () => {
      const a = randV()
      const b = randV()
      const left = _v(a, '+', b)
      const right = _v(b, '+', a)
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
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
        for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(va, vb)) {
          expect(r1).toBeCloseTo(r2)
          expect(i1).toBeCloseTo(i2)
        }
      }
    })
    it('commutes with addition', () => {
      const a = randM()
      const b = randM()
      const left = _m(a, '+', b)
      const right = _m(b, '+', a)
      for (const [va, vb] of V.zipVectors(left, right)) {
        for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(va, vb)) {
          expect(r1).toBeCloseTo(r2)
          expect(i1).toBeCloseTo(i2)
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
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('abides scalar unitor', () => {
      const p = randV()
      expect(__(C.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = rand()
      const p = randV()
      const q = randV()
      const left = __(a, '.*', _v(p, '+', q))
      const right = _v(__(a, '.*', p), '+', __(a, '.*', q))
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = rand()
      const b = rand()
      const p = randV()
      const left = __(_(a, '+', b), '.*', p)
      const right = _v(__(a, '.*', p), '+', __(b, '.*', p))
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of V.zipVectors(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
  })
  describe('Inner Product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randV()
      const y = randV()
      const { Re: r1, Im: i1 } = C.dot(x, y)
      const { Re: r2, Im: i2 } = C.conj(C.dot(y, x))
      expect(r1).toBeCloseTo(r2)
      expect(i1).toBeCloseTo(i2)
    })
    it('is linear in its first argument', () => {
      const a = rand()
      const b = rand()
      const x = randV()
      const y = randV()
      const z = randV()
      const left1 = __(a, '.*', x)
      const left2 = __(b, '.*', y)
      const { Re: r1, Im: i1 } = C.dot(_v(left1, '+', left2), z)
      const right1 = _(a, '*', C.dot(x, z))
      const right2 = _(b, '*', C.dot(y, z))
      const { Re: r2, Im: i2 } = _(right1, '+', right2)
      expect(r1).toBeCloseTo(r2)
      expect(i1).toBeCloseTo(i2)
    })
    it('is nonzero for nonzero x', () => {
      const x = randV()
      const { Re } = C.dot(x, x)
      expect(Re).not.toBeCloseTo(0)
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
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = randP()
      const b = randP()
      const c = randP()
      const left = _p(a, '*', _p(b, '*', c))
      const right = _p(_p(a, '*', b), '*', c)
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('commutes with addition', () => {
      const a = randP()
      const b = randP()
      const left = _p(a, '+', b)
      const right = _p(b, '+', a)
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('commutes with multiplication', () => {
      const a = randP()
      const b = randP()
      const left = _p(a, '*', b)
      const right = _p(b, '*', a)
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
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
      for (const [{ Re: re1, Im: i1 }, { Re: re2, Im: i2 }] of zipP(l1, r1)) {
        expect(re1).toBeCloseTo(re2)
        expect(i1).toBeCloseTo(i2)
      }
      for (const [{ Re: re1, Im: i1 }, { Re: re2, Im: i2 }] of zipP(l2, r2)) {
        expect(re1).toBeCloseTo(re2)
        expect(i1).toBeCloseTo(i2)
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
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('abides scalar unitor', () => {
      const p = randP()
      expect(__p(C.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = rand()
      const p = randP()
      const q = randP()
      const left = __p(a, '.*', _p(p, '+', q))
      const right = _p(__p(a, '.*', p), '+', __p(a, '.*', q))
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = rand()
      const b = rand()
      const p = randP()
      const left = __p(_(a, '+', b), '.*', p)
      const right = _p(__p(a, '.*', p), '+', __p(b, '.*', p))
      for (const [{ Re: r1, Im: i1 }, { Re: r2, Im: i2 }] of zipP(left, right)) {
        expect(r1).toBeCloseTo(r2)
        expect(i1).toBeCloseTo(i2)
      }
    })
  })
  describe('Polynomial Inner Product laws', () => {
    it('abides conjugate symmetry', () => {
      const x = randP()
      const y = randP()
      const { Re: r1, Im: i1 } = C.polynomialInnerProduct(x, y)
      const { Re: r2, Im: i2 } = C.conj(C.polynomialInnerProduct(y, x))
      expect(r1).toBeCloseTo(r2)
      expect(i1).toBeCloseTo(i2)
    })
    it('is linear in its first argument', () => {
      const a = rand()
      const b = rand()
      const x = randP()
      const y = randP()
      const z = randP()
      const left1 = __p(a, '.*', x)
      const left2 = __p(b, '.*', y)
      const { Re: r1, Im: i1 } = C.polynomialInnerProduct(_p(left1, '+', left2), z)
      const right1 = _(a, '*', C.polynomialInnerProduct(x, z))
      const right2 = _(b, '*', C.polynomialInnerProduct(y, z))
      const { Re: r2, Im: i2 } = _(right1, '+', right2)

      expect(r1).toBeCloseTo(r2)
      expect(i1).toBeCloseTo(i2)
    })
    it('is nonzero for nonzero x', () => {
      const x = randP()
      const { Re, Im } = C.polynomialInnerProduct(x, x)
      expect(Re).not.toBeCloseTo(0)
      expect(Im).toBeCloseTo(0)
    })
  })
})
