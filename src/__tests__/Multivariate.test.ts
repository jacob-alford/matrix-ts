import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/function'

import * as V from '../Vector'
import * as Stat from '../Multivariate'

describe('Multivariate', () => {
  it('calculates a covariance matrix', () => {
    const sample: Stat.Sample<3> = pipe(
      [V.fromTuple([1, 2, 5]), V.fromTuple([4, 1, 6])],
      RNEA.concat(RNEA.of(V.fromTuple([4, 0, 4])))
    )

    const cov = Stat.covariance(sample)

    expect(cov).toStrictEqual([
      [3, -3 / 2, 0],
      [-3 / 2, 1, 1 / 2],
      [0, 1 / 2, 1],
    ])
  })
})
