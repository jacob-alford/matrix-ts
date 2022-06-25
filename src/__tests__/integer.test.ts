import * as Int from '../integer'
import * as V from '../Vector'
import * as M from '../Matrix'
import * as Inf from '../infix'

const { _ } = Int

const AbGrp = V.getAdditiveAbelianGroup(Int.EuclideanRing)(10)
const AbGrpM = M.getAdditiveAbelianGroup(Int.EuclideanRing)(10, 10)

const _v = Inf.getAbGrpInfix(AbGrp)
const _m = Inf.getAbGrpInfix(AbGrpM)

describe('Int', () => {
  const rand = Int.randInt(-1_000_000, 1_000_000)
  const randV = V.randVec(10, rand)
  const randM = M.randMatrix(10, 10, rand)
  describe('EuclidianRing laws', () => {
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', Int.zero)).toBe(test)
      expect(_(Int.zero, '+', test)).toBe(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', Int.one)).toBe(test)
      expect(_(Int.one, '*', test)).toBe(test)
    })
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '+', _(b, '+', c))).toBe(_(_(a, '+', b), '+', c))
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '*', c))).toBe(_(_(a, '*', b), '*', c))
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '+', b)).toBe(_(b, '+', a))
    })
    it('commutes with multiplication', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '*', b)).toBe(_(b, '*', a))
    })
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '+', c))).toBe(_(_(a, '*', b), '+', _(a, '*', c)))
      expect(_(_(a, '+', b), '*', c)).toBe(_(_(a, '*', c), '+', _(b, '*', c)))
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toBe(Int.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toBe(Int.one)
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
})
