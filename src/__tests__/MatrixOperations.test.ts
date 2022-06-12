import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

import * as MatOps from '../MatrixOperations'
import * as Log from '../Logger'
import * as M from '../MatrixC'
import * as FM from '../FreeMonoid'
import * as V from '../VectorC'

describe('Gaussian Elimination with Partial Pivoting', () => {
  it('returns a factorized matrix', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting({
      logger: Log.LoggerVoid,
    })(
      M.fromNestedTuples([
        [0.02, 0.01, 0, 0],
        [1, 2, 1, 0],
        [0, 1, 2, 1],
        [0, 0, 100, 200],
      ])
    )

    const expected = M.fromNestedTuples([
      [1, 2, 1, 0],
      [0, 1, 2, 1],
      [0, 0, 100, 200],
      [0, 0, 0, -0.05],
    ])

    pipe(logs, FM.IsoReadonlyArray.get, RA.sequence(IO.Applicative))()

    if (E.isLeft(result)) {
      throw new Error('Unexpected result')
    }
    const [, upperMatrix] = result.right

    for (const [ra, rb] of V.zipVectors(expected, upperMatrix)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
  })
  it('detects a singular matrix (i)', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting({
      logger: Log.LoggerVerbosePure,
    })(
      M.fromNestedTuples([
        [1, -2],
        [-3, 6],
      ])
    )

    pipe(logs, FM.IsoReadonlyArray.get, RA.sequence(IO.Applicative))()

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('Matrix is singular')
  })
  it('detects a singular matrix (ii)', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting({
      logger: Log.LoggerVerbosePure,
    })(
      M.fromNestedTuples([
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
      ])
    )

    pipe(logs, FM.IsoReadonlyArray.get, RA.sequence(IO.Applicative))()

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('Matrix is singular')
  })
  it('detects a singular matrix (iii)', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting({
      logger: Log.LoggerVerbosePure,
    })(
      M.fromNestedTuples([
        [1, 2],
        [-2, -4],
      ])
    )

    pipe(logs, FM.IsoReadonlyArray.get, RA.sequence(IO.Applicative))()

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('Matrix is singular')
  })
})
