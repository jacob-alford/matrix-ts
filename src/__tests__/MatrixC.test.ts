import * as Mat from '../Matrix'
import * as V from '../Vector'
import * as N from '../number'

describe('Mat', () => {
  describe('id', () => {
    it('should return the identity matrix', () => {
      const id = Mat.id(N.Field)(5)
      expect(id).toStrictEqual([
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
      ])
    })
  })
  describe('repeat()', () => {
    it('repeats a matrix', () => {
      const repeat = Mat.repeat(2)(5, 5)
      expect(repeat).toStrictEqual([
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
      ])
    })
  })
  describe('getAdditiveAbelianGroup()', () => {
    const AdditiveAbelianGroup = Mat.getAdditiveAbelianGroup(N.Field)(3, 3)
    const a = Mat.fromNestedTuples([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
    const b = Mat.fromNestedTuples([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
    const c = Mat.repeat(N.Field.zero)(3, 3)
    it('adds two matricies', () => {
      expect(AdditiveAbelianGroup.concat(a, b)).toStrictEqual([
        [2, 4, 6],
        [8, 10, 12],
        [14, 16, 18],
      ])
    })
    it('subtracts two matricies', () => {
      expect(
        AdditiveAbelianGroup.concat(a, AdditiveAbelianGroup.inverse(b))
      ).toStrictEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ])
    })
    it('adds zero', () => {
      expect(AdditiveAbelianGroup.concat(a, c)).toStrictEqual(a)
      expect(AdditiveAbelianGroup.concat(c, a)).toStrictEqual(a)
    })
  })
  describe('getBimodule()', () => {
    const Bimodule = Mat.getBimodule(N.Field)(3, 3)
    const a = Mat.fromNestedTuples([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
    it('leftScalarMultiplies', () => {
      expect(Bimodule.leftScalarMul(2, a)).toStrictEqual([
        [2, 4, 6],
        [8, 10, 12],
        [14, 16, 18],
      ])
    })
    it('rightScalarMultiplies', () => {
      expect(Bimodule.rightScalarMul(a, 0)).toStrictEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ])
    })
  })
  describe('mul()', () => {
    it('should multiply two matrices', () => {
      const a = Mat.fromNestedTuples([
        [1, 2],
        [3, 4],
      ])
      const b = Mat.fromNestedTuples([
        [5, 6],
        [7, 8],
      ])
      const c = Mat.mul(N.Field)(a, b)
      expect(c).toStrictEqual([
        [19, 22],
        [43, 50],
      ])
    })
  })
  describe('trace()', () => {
    it('should return the trace of a matrix', () => {
      const a = Mat.fromNestedTuples([
        [1, 2],
        [3, 4],
      ])
      expect(Mat.trace(N.Field)(a)).toStrictEqual(5)
    })
  })
  describe('transpose()', () => {
    it('transposes a 2x2 matrix', () => {
      const m = Mat.fromNestedTuples([
        [1, 2],
        [3, 4],
      ])
      const t = Mat.transpose(m)
      expect(t).toStrictEqual([
        [1, 3],
        [2, 4],
      ])
    })
    it('transposes a 1x3 matrix', () => {
      const m = Mat.fromNestedTuples([[1, 2, 3]])
      const t = Mat.transpose(m)
      expect(t).toStrictEqual([[1], [2], [3]])
    })
    it('transposes a 3x3 matrix', () => {
      const m = Mat.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = Mat.transpose(m)
      expect(t).toStrictEqual([
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ])
    })
  })
  describe('outerProduct', () => {
    it('works', () => {
      const a = V.fromTuple([1, 2, 3])
      const b = V.fromTuple([4, 5])
      expect(N.outerProduct(a, b)).toStrictEqual(
        Mat.fromNestedTuples([
          [4, 5],
          [8, 10],
          [12, 15],
        ])
      )
    })
  })
})
