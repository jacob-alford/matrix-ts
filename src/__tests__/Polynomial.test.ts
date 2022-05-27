import * as N from 'fp-ts/number'

import * as Poly from '../Polynomial'
import * as Exp from '../Exponentiate'

const construct = Poly.fromCoefficientArray
const R = Poly.getRing<number>(N.Field)
const G = Poly.getAdditiveAbelianGroup<number>(N.Field)
const evaluate = Poly.evaluate(N.Field, Exp.ExpNumber)

describe('Polynomial', () => {
  describe('evaluation', () => {
    it('evaluates a polynomial', () => {
      const p = construct([1, 2, 3])
      expect(evaluate(p, 5)).toBe(86)
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
