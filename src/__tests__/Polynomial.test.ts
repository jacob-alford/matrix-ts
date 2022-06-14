import * as Poly from '../Polynomial'
import * as N from '../number'

const construct = Poly.fromCoefficientArray
const R = Poly.getRing<number>(N.Field)
const G = Poly.getAdditiveAbelianGroup<number>(N.Field)
const evaluate = Poly.evaluate(N.Field, N.Exp)
const { equals } = Poly.getPolynomialEq<number, number>(N.Field)

describe('Polynomial', () => {
  describe('evaluation', () => {
    it('evaluates a polynomial', () => {
      const p = construct([1, 2, 3])
      expect(evaluate(p, 5)).toBe(86)
    })
  })
  describe('calculus', () => {
    it('differentiates a polynomial', () => {
      const a = construct([1, 2, 3])
      const aP = N.differentiate(a)
      const expected = construct([2, 6])
      expect(equals(aP, expected)).toBe(true)
    })
    it('integrates a polynomial', () => {
      const a = construct([1, 2, 3])
      const aP = N.indefiniteIntegral(1)(a)
      const expected = construct([1, 1, 1, 1])
      expect(equals(aP, expected)).toBe(true)
    })
  })
  describe('Ring', () => {
    it('multiplies two polynomials', () => {
      const a = construct([1, 2])
      const b = construct([4, 5])
      const c = construct([10])
      const ab = construct([4, 13, 10])
      const abc = construct([40, 130, 100])
      expect(R.mul(R.mul(a, b), c)).toStrictEqual(abc)
      expect(R.mul(a, R.mul(b, c))).toStrictEqual(abc)
      expect(R.mul(a, b)).toStrictEqual(ab)
      expect(R.mul(b, a)).toStrictEqual(ab)
      expect(R.mul(a, R.one)).toStrictEqual(a)
      expect(R.mul(R.one, a)).toStrictEqual(a)
    })
    it('adds two polynomials', () => {
      const a = construct([1, 2, 3, 4, 5])
      const b = construct([4, 5, 0, 7, 0, 9, 10])
      const c = construct([0, 0, 0, 0, 5])
      const ab = construct([5, 7, 3, 11, 5, 9, 10])
      const abc = construct([5, 7, 3, 11, 10, 9, 10])
      expect(R.add(R.add(a, b), c)).toStrictEqual(abc)
      expect(R.add(a, R.add(b, c))).toStrictEqual(abc)
      expect(R.add(a, b)).toStrictEqual(ab)
      expect(R.add(b, a)).toStrictEqual(ab)
      expect(R.add(a, R.zero)).toStrictEqual(a)
      expect(R.add(R.zero, a)).toStrictEqual(a)
    })
    it('subtracts two polynomials', () => {
      const a = construct([1, 2, 3, 4, 5])
      const b = construct([4, 5, 0, 7, 0, 9, 10])
      const ab = construct([-3, -3, 3, -3, 5, -9, -10])
      expect(R.sub(a, a)).toStrictEqual(construct([0, 0, 0, 0, 0]))
      const test = Math.random()
      expect(evaluate(R.sub(a, a), test)).toStrictEqual(evaluate(R.zero, test))
      expect(R.sub(a, b)).toStrictEqual(ab)
      expect(R.sub(b, a)).toStrictEqual(G.inverse(ab))
    })
  })
})
