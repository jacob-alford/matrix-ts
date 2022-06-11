import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

import * as MatOps from '../MatrixOperations'
import * as M from '../MatrixC'
import * as N_ from '../number'
import * as C_ from '../console'
import * as LFM from '../LoggerFreeMonoid'

describe('Gaussian Elimination with Partial Pivoting', () => {
  it('returns a factorized matrix', () => {
    const [result, logs] = MatOps.guassianEliminationWithPartialPivoting(C_.LoggerImpure)(
      N.Ord,
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
    pipe(logs, LFM.toReadonlyArray, RA.sequence(IO.Applicative))()
    const expected = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    expect(result).toEqual(O.some(expected))
  })
})
