import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as N from 'fp-ts/number'
import { pipe } from 'fp-ts/function'

import * as MatOps from '../MatrixOperations'
import * as FM from '../LoggerFreeMonoid'
import * as M from '../MatrixC'
import * as V from '../VectorC'
import * as N_ from '../number'
import * as C_ from '../console'

describe('Gaussian Elimination with Partial Pivoting', () => {
  it('returns a factorized matrix', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting(C_.LoggerVoid)(
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
})
