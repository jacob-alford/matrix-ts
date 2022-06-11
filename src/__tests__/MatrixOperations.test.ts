import * as N from 'fp-ts/number'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

import * as MatOps from '../MatrixOperations'
import * as M from '../MatrixC'
import * as V from '../VectorC'
import * as N_ from '../number'
import * as C_ from '../console'
import * as LFM from '../LoggerFreeMonoid'

describe('Gaussian Elimination with Partial Pivoting', () => {
  it('returns a factorized matrix', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting(
      C_.LoggerSparseImpure
    )(
      N.Bounded,
      N.Field,
      N_.Abs
    )(
      M.fromNestedTuples([
        [0.02, 0.01, 0, 0],
        [1, 2, 1, 0],
        [0, 1, 2, 1],
        [0, 0, 100, 200],
      ])
    )
    pipe(logs, LFM.IsoReadonlyArray.get, RA.sequence(IO.Applicative))()
    const expected = M.fromNestedTuples([
      [1, 2, 1, 0],
      [0, 1, 2, 1],
      [0, 0, 100, 200],
      [0, 0, 0, -0.05],
    ])
    if (O.isNone(result)) {
      throw new Error('Unexpected result')
    }
    const [, upperMatrix] = result.value

    for (const [ra, rb] of V.zipVectors(expected, upperMatrix)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
  })
})
