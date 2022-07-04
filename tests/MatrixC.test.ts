import * as M from '../src/Matrix'
import * as V from '../src/Vector'
import * as N from '../src/number'

describe('Mat', () => {
  describe('id', () => {
    it('should return the identity matrix', () => {
      const id = M.identity(N.Field)(5)
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
      const repeat = M.repeat(2)(5, 5)
      expect(repeat).toStrictEqual([
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
      ])
    })
  })
  describe('mul()', () => {
    it('should multiply two matrices', () => {
      const a = M.fromNestedTuples([
        [1, 2],
        [3, 4],
      ])
      const b = M.fromNestedTuples([
        [5, 6],
        [7, 8],
      ])
      const c = M.mul(N.Field)(a, b)
      expect(c).toStrictEqual([
        [19, 22],
        [43, 50],
      ])
    })
  })
  describe('trace()', () => {
    it('should return the trace of a matrix', () => {
      const a = M.fromNestedTuples([
        [1, 2],
        [3, 4],
      ])
      expect(M.trace(N.Field)(a)).toStrictEqual(5)
    })
  })
  describe('transpose()', () => {
    it('transposes a 2x2 matrix', () => {
      const m = M.fromNestedTuples([
        [1, 2],
        [3, 4],
      ])
      const t = M.transpose(m)
      expect(t).toStrictEqual([
        [1, 3],
        [2, 4],
      ])
    })
    it('transposes a 1x3 matrix', () => {
      const m = M.fromNestedTuples([[1, 2, 3]])
      const t = M.transpose(m)
      expect(t).toStrictEqual([[1], [2], [3]])
    })
    it('transposes a 3x3 matrix', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = M.transpose(m)
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
        M.fromNestedTuples([
          [4, 5],
          [8, 10],
          [12, 15],
        ])
      )
    })
  })
})
