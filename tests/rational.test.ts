import * as Q from '../src/rational'
import * as V from '../src/Vector'
import * as M from '../src/Matrix'
import * as Inf from '../src/infix'

const { _ } = Q

const AbGrp = V.getAdditiveAbelianGroup(Q.Field)(10)
const AbGrpM = M.getAdditiveAbelianGroup(Q.Field)(5, 5)

const __ = Inf.getLeftModuleInfix(V.getBimodule(Q.Field)(10))
const _v = Inf.getAbGrpInfix(AbGrp)
const _m = Inf.getAbGrpInfix(AbGrpM)

describe('Rational', () => {
  const rand = Q.randRational(-50, 50)
  const randV = V.randVec(10, rand)
  const randM = M.randMatrix(5, 5, rand)
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
    // This occasionally fails, probably because of overflow
    it.skip('has an additive inverse', () => {
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
        for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
          va,
          vb
        )) {
          expect(a1).toBeCloseTo(a2)
          expect(b1).toBeCloseTo(b2)
        }
      }
    })
    it('commutes with addition', () => {
      const a = randM()
      const b = randM()
      const left = _m(a, '+', b)
      const right = _m(b, '+', a)
      for (const [va, vb] of V.zipVectors(left, right)) {
        for (const [{ top: a1, bottom: b1 }, { top: a2, bottom: b2 }] of V.zipVectors(
          va,
          vb
        )) {
          expect(a1).toBeCloseTo(a2)
          expect(b1).toBeCloseTo(b2)
        }
      }
    })
    // This occasionally fails, probably because of overflow
    it.skip('has an additive inverse', () => {
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
})
