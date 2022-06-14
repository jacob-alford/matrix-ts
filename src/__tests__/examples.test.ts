import * as LM from '../LinearMap'
import * as N from '../number'
import * as Poly from '../Polynomial'
import * as V from '../VectorC'

describe('examples', () => {
  describe('vectors', () => {
    it('dots two vectors', () => {
      const a = V.fromTuple([1, 2, 3, 4, 5, 6])
      const b = V.fromTuple([4, 5, 6, 7, 8, 9])
      expect(N.InnerProductSpace6d.dot(a, b)).toBe(154)
    })
    it('crosses two vectors', () => {
      const a = V.fromTuple([0, 2, 1])
      const b = V.fromTuple([3, -1, 0])
      expect(N.cross(a, b)).toStrictEqual(V.fromTuple([1, 3, -6]))
    })
  })
  describe('linear maps', () => {
    it('differentiates and integrates polynomials', () => {
      const { equals } = Poly.getPolynomialEq<number, number>(N.Field)

      const differentiateThenIntegrate = LM.compose2(
        N.DifferentialLinearMap,
        N.getDefiniteIntegralLinearMap(1)
      )
      const integrateThenDifferentiate = LM.compose2(
        N.getDefiniteIntegralLinearMap(1),
        N.DifferentialLinearMap
      )

      const a = Poly.fromCoefficientArray([1, 2, 3])

      expect(equals(differentiateThenIntegrate.mapL(a), a)).toBe(true)
      expect(equals(integrateThenDifferentiate.mapL(a), a)).toBe(true)
    })
    it('rotates a 2d vector 270 degrees', () => {
      const rotate90Degrees = N.getRotationMap2d(Math.PI / 2)
      const rotate180Degres = N.getRotationMap2d(Math.PI)

      const rotate270Degrees = LM.compose2(rotate90Degrees, rotate180Degres)

      const initial = V.fromTuple([1, 0])
      const rotated = rotate270Degrees.mapL(initial)
      const expected = V.fromTuple([0, -1])

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
    })
    it('rotates a 3d vector along three axies', () => {
      const rotateX45 = N.getXRotationMap3d(Math.PI / 4)
      const rotateY180 = N.getYRotationMap3d(Math.PI)
      const rotateZ90 = N.getZRotationMap3d(Math.PI / 2)

      const rotate = LM.compose2(rotateX45, LM.compose2(rotateY180, rotateZ90))

      const initial = V.fromTuple([0, 0, 1])
      const rotated = rotate.mapL(initial)
      const expected = V.fromTuple([1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)])

      for (const [a, b] of V.zipVectors(rotated, expected)) {
        expect(a).toBeCloseTo(b)
      }
    })
  })
})
