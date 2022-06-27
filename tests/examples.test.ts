import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/function'

import * as Auto from '../src/Automorphism'
import * as Int from '../src/integer'
import * as H from '../src/quaternion'
import * as N from '../src/number'
import * as Poly from '../src/Polynomial'
import * as V from '../src/Vector'
import * as Q from '../src/rational'

describe('examples', () => {
  describe('polynomials', () => {
    it('multiples two polynomials', () => {
      const fromArr = Poly.fromCoefficientArray(Int.Eq, Int.EuclideanRing)
      const mul = Poly.mul(Int.Eq, Int.EuclideanRing)
      const _ = Int.fromNumber
      const { show } = Poly.getShow('x')(
        Int.Show,
        a => a === 0,
        a => a === 1
      )

      // x + x^2
      const p1 = fromArr([_(0), _(1), _(1)])
      // 1 + x^4
      const p2 = fromArr([_(1), _(0), _(0), _(0), _(1)])

      // Expected: x + x^2 + x^5 + x^6
      const result = mul(p1, p2)

      expect(show(result)).toBe('x + x^2 + x^5 + x^6')
    })
  })
  describe('fractions', () => {
    it('adds fractions', () => {
      const { _ } = Q

      const a = Q.of(Int.fromNumber(1), Int.fromNumber(2))
      const b = Q.of(Int.fromNumber(1), Int.fromNumber(3))

      const c = pipe(
        O.Do,
        O.apS('a', a),
        O.apS('b', b),
        O.map(({ a, b }) => _(a, '+', b))
      )

      const expected = Q.of(Int.fromNumber(5), Int.fromNumber(6))

      expect(c).toStrictEqual(expected)
    })
  })
  describe('vectors', () => {
    it('dots two vectors', () => {
      const a = V.fromTuple([1, 2, 3, 4, 5, 6])
      const b = V.fromTuple([4, 5, 6, 7, 8, 9])
      expect(N.dot(a, b)).toBe(154)
    })
    it('crosses two vectors', () => {
      const a = V.fromTuple([0, 2, 1])
      const b = V.fromTuple([3, -1, 0])
      expect(N.cross(a, b)).toStrictEqual(V.fromTuple([1, 3, -6]))
    })
  })
  describe('linear maps', () => {
    it('differentiates and integrates polynomials', () => {
      const { equals } = Poly.getPolynomialEq<number>(N.Eq)

      const L = N.getDifferentialAutomorphism(1)

      const thereAndBack = flow(L.get, L.reverseGet)
      const hereAndThere = flow(L.reverseGet, L.get)

      const a = Poly.fromCoefficientArray(N.Eq, N.Field)([1, 2, 3])

      expect(equals(thereAndBack(a), a)).toBe(true)
      expect(equals(hereAndThere(a), a)).toBe(true)
    })
    it('rotates a 2d vector and back 270 degrees', () => {
      const rotate90Degrees = N.get2dRotation(Math.PI / 2)
      const rotate180Degres = N.get2dRotation(Math.PI)

      const T = Auto.compose(rotate90Degrees, rotate180Degres)

      const initial = V.fromTuple([1, 0])
      const rotated = T.get(initial)
      const expected = V.fromTuple([0, -1])
      const reversed = T.reverseGet(rotated)

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of V.zipVectors(reversed, initial)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('rotates a 3d vector and back along three axies', () => {
      const rotateX45 = N.get3dXRotation(Math.PI / 4)
      const rotateY180 = N.get3dYRotation(Math.PI)
      const rotateZ90 = N.get3dZRotation(Math.PI / 2)

      const T = Auto.compose(rotateX45, Auto.compose(rotateY180, rotateZ90))

      const initial = V.fromTuple([0, 0, 1])
      const rotated = T.get(initial)
      const reversed = T.reverseGet(rotated)
      const expected = V.fromTuple([1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)])

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of V.zipVectors(reversed, initial)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('rotates a 3d vector using quaternions', () => {
      const T = H.getRotationAutomorphism(
        // Around axis:
        V.fromTuple([1, 1, 1]),
        // By angle:
        (2 * Math.PI) / 3
      )

      const initial = V.fromTuple([1, 0, 0])
      const rotated = T.get(initial)
      const reversed = T.reverseGet(rotated)
      const expected = V.fromTuple([0, 1, 0])

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of V.zipVectors(reversed, initial)) {
        expect(a).toBeCloseTo(b)
      }
    })
  })
})
