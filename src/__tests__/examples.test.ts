import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/function'

import * as LI from '../LinearIsomorphism'
import * as Int from '../integer'
import * as H from '../quaternion'
import * as N from '../number'
import * as Poly from '../Polynomial'
import * as V from '../Vector'
import * as Q from '../rational'

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

      const { mapL, reverseMapL } = N.getDifferentialLinearIsomorphism(1)

      const thereAndBack = flow(mapL, reverseMapL)
      const hereAndThere = flow(reverseMapL, mapL)

      const a = Poly.fromCoefficientArray(N.Eq, N.Field)([1, 2, 3])

      expect(equals(thereAndBack(a), a)).toBe(true)
      expect(equals(hereAndThere(a), a)).toBe(true)
    })
    it('rotates a 2d vector and back 270 degrees', () => {
      const rotate90Degrees = N.getRotationMap2d(Math.PI / 2)
      const rotate180Degres = N.getRotationMap2d(Math.PI)

      const { mapL, reverseMapL } = LI.compose(rotate90Degrees, rotate180Degres)

      const initial = V.fromTuple([1, 0])
      const rotated = mapL(initial)
      const expected = V.fromTuple([0, -1])
      const reversed = reverseMapL(rotated)

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of V.zipVectors(reversed, initial)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('rotates a 3d vector and back along three axies', () => {
      const rotateX45 = N.getXRotationMap3d(Math.PI / 4)
      const rotateY180 = N.getYRotationMap3d(Math.PI)
      const rotateZ90 = N.getZRotationMap3d(Math.PI / 2)

      const rotate = LI.compose(rotateX45, LI.compose(rotateY180, rotateZ90))

      const initial = V.fromTuple([0, 0, 1])
      const rotated = rotate.mapL(initial)
      const reversed = rotate.reverseMapL(rotated)
      const expected = V.fromTuple([1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)])

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
      for (const [a, b] of V.zipVectors(reversed, initial)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('rotates a 3d vector using quaternions', () => {
      const { mapL, reverseMapL } = H.getRotationLinearIsomorpism(
        // Around axis:
        V.fromTuple([1, 1, 1]),
        // By angle:
        (2 * Math.PI) / 3
      )

      const initial = V.fromTuple([1, 0, 0])
      const rotated = mapL(initial)
      const reversed = reverseMapL(rotated)
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
