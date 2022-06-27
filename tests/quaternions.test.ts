import * as H from '../src/quaternion'
import * as Inf from '../src/infix'
import * as N from '../src/number'

const { _ } = H

const __ = Inf.getLeftModuleInfix(H.Bimodule)
const _v = Inf.getAbGrpInfix(H.AdditiveAbelianGroup)
const _n = N._

describe('Quaternions', () => {
  const rand = H.randQuaternion(-5_000, 5_000)
  const randN = N.randNumber(-5_000, 5_000)
  describe('DivisionRing laws', () => {
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', H.zero)).toStrictEqual(test)
      expect(_(H.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', H.one)).toStrictEqual(test)
      expect(_(H.one, '*', test)).toStrictEqual(test)
    })
    /** This appears to fail with large numbers */
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { a: a1, b: b1, c: c1, d: d1 } = _(a, '+', _(b, '+', c))
      const { a: a2, b: b2, c: c2, d: d2 } = _(_(a, '+', b), '+', c)
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
      expect(c1).toBeCloseTo(c2)
      expect(d1).toBeCloseTo(d2)
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { a: a1, b: b1, c: c1, d: d1 } = _(a, '*', _(b, '*', c))
      const { a: a2, b: b2, c: c2, d: d2 } = _(_(a, '*', b), '*', c)
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
      expect(c1).toBeCloseTo(c2)
      expect(d1).toBeCloseTo(d2)
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '+', b)).toStrictEqual(_(b, '+', a))
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(H.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      const { a: a1, b: b1, c: c1, d: d1 } = _(a, '/.', a)
      const { a: a2, b: b2, c: c2, d: d2 } = _(a, './', a)
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
      expect(c1).toBeCloseTo(c2)
      expect(d1).toBeCloseTo(d2)
      expect(a1).toBeCloseTo(H.one.a)
      expect(b1).toBeCloseTo(H.one.b)
      expect(c1).toBeCloseTo(H.one.c)
      expect(d1).toBeCloseTo(H.one.d)
      expect(a2).toBeCloseTo(H.one.a)
      expect(b2).toBeCloseTo(H.one.b)
      expect(c2).toBeCloseTo(H.one.c)
      expect(d2).toBeCloseTo(H.one.d)
    })
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { a: a1l, b: b1l, c: c1l, d: d1l } = _(a, '*', _(b, '+', c))
      const { a: a2l, b: b2l, c: c2l, d: d2l } = _(_(a, '*', b), '+', _(a, '*', c))
      const { a: a1r, b: b1r, c: c1r, d: d1r } = _(_(a, '+', b), '*', c)
      const { a: a2r, b: b2r, c: c2r, d: d2r } = _(_(a, '*', c), '+', _(b, '*', c))

      expect(a1l).toBeCloseTo(a2l)
      expect(b1l).toBeCloseTo(b2l)
      expect(c1l).toBeCloseTo(c2l)
      expect(d1l).toBeCloseTo(d2l)
      expect(a1r).toBeCloseTo(a2r)
      expect(b1r).toBeCloseTo(b2r)
      expect(c1r).toBeCloseTo(c2r)
      expect(d1r).toBeCloseTo(d2r)
    })
  })
  describe('Vector Space laws', () => {
    it('associates over scalar multiplication', () => {
      const a = randN()
      const b = randN()
      const p = rand()
      const left = __(a, '.*', __(b, '.*', p))
      const right = __(_n(a, '*', b), '.*', p)
      const { a: a1, b: b1, c: c1, d: d1 } = left
      const { a: a2, b: b2, c: c2, d: d2 } = right
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
      expect(c1).toBeCloseTo(c2)
      expect(d1).toBeCloseTo(d2)
    })
    it('abides scalar unitor', () => {
      const p = rand()
      expect(__(N.one, '.*', p)).toStrictEqual(p)
    })
    it('distributes over scalar multiplication wrt polynomial addition', () => {
      const a = randN()
      const p = rand()
      const q = rand()
      const left = __(a, '.*', _v(p, '+', q))
      const right = _v(__(a, '.*', p), '+', __(a, '.*', q))
      const { a: a1, b: b1, c: c1, d: d1 } = left
      const { a: a2, b: b2, c: c2, d: d2 } = right
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
      expect(c1).toBeCloseTo(c2)
      expect(d1).toBeCloseTo(d2)
    })
    it('distributes over scalar multiplication wrt Field addition', () => {
      const a = randN()
      const b = randN()
      const p = rand()
      const left = __(_n(a, '+', b), '.*', p)
      const right = _v(__(a, '.*', p), '+', __(b, '.*', p))
      const { a: a1, b: b1, c: c1, d: d1 } = left
      const { a: a2, b: b2, c: c2, d: d2 } = right
      expect(a1).toBeCloseTo(a2)
      expect(b1).toBeCloseTo(b2)
      expect(c1).toBeCloseTo(c2)
      expect(d1).toBeCloseTo(d2)
    })
  })
})
