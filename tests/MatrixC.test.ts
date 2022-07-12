import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

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
  describe('linMap', () => {
    it('maps on the left', () => {
      const x = V.fromTuple([1, 2])
      const A = M.fromNestedTuples([
        [0, 1],
        [1, 0],
      ])
      expect(N.linMap(A, x)).toStrictEqual([2, 1])
    })
    it('maps on the right', () => {
      const x = V.fromTuple([1, 2])
      const A = M.fromNestedTuples([
        [0, 1],
        [1, 0],
      ])
      expect(N.linMapR(x, A)).toStrictEqual([2, 1])
    })
  })
  describe('sub matrix', () => {
    it('maps a row', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(
        m,
        M.mapRow(2, a => a ** 2)
      )
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 3],
          [4, 5, 6],
          [49, 64, 81],
        ])
      )
    })
    it('reduces by row', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.reduceByRow(N.lInfNorm))
      expect(t).toStrictEqual([3, 6, 9])
    })
    it('maps a column', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(
        m,
        M.mapColumn(2, a => a ** 2)
      )
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 9],
          [4, 5, 36],
          [7, 8, 81],
        ])
      )
    })
    it('reduces by column', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.reduceByColumn(N.lInfNorm))
      expect(t).toStrictEqual([7, 8, 9])
    })
    it('gets a sub-column', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.getSubColumn(2, 1))
      expect(t).toStrictEqual(O.some([6, 9]))
    })
    it('updates a sub-column', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.updateSubColumn(2, 1, V.fromTuple([69, 69])))
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 3],
          [4, 5, 69],
          [7, 8, 69],
        ])
      )
    })
    it('gets a sub-matrix', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.getSubMatrix(1, 1, 2))
      expect(t).toStrictEqual(O.some([[5, 6]]))
    })
    it('updates a sub-matrix', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.updateSubMatrix(1, 1, M.fromNestedTuples([[69, 69]])))
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 3],
          [4, 69, 69],
          [7, 8, 9],
        ])
      )
    })
    it('prepends a column', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.prependColumn(V.fromTuple([69, 69, 69])))
      expect(t).toStrictEqual([
        [69, 1, 2, 3],
        [69, 4, 5, 6],
        [69, 7, 8, 9],
      ])
    })
    it('appends a column', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.appendColumn(V.fromTuple([69, 69, 69])))
      expect(t).toStrictEqual([
        [1, 2, 3, 69],
        [4, 5, 6, 69],
        [7, 8, 9, 69],
      ])
    })
    it('crops a matrix by rows', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
      ])
      const t = pipe(m, M.cropRows)
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ])
      )
    })
    it('crops a matrix by columns', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3, 10],
        [4, 5, 6, 11],
        [7, 8, 9, 12],
      ])
      const t = pipe(m, M.cropColumns)
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ])
      )
    })
    it('switches rows', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.switchRows(1, 2))
      expect(t).toStrictEqual(
        O.some([
          [1, 2, 3],
          [7, 8, 9],
          [4, 5, 6],
        ])
      )
    })
    it('switches columns', () => {
      const m = M.fromNestedTuples([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
      const t = pipe(m, M.switchColumns(1, 2))
      expect(t).toStrictEqual(
        O.some([
          [1, 3, 2],
          [4, 6, 5],
          [7, 9, 8],
        ])
      )
    })
  })
})
