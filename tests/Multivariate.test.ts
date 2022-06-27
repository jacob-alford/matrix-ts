import * as V from '../src/Vector'
import * as Stat from '../src/Multivariate'

describe('Multivariate', () => {
  it('calculates a covariance matrix', () => {
    const sample: Stat.MultivariateSample<3> = [
      V.fromTuple([1, 2, 5]),
      V.fromTuple([4, 1, 6]),
      V.fromTuple([4, 0, 4]),
    ]

    const cov = Stat.covariance(sample)

    expect(cov).toStrictEqual([
      [3, -3 / 2, 0],
      [-3 / 2, 1, 1 / 2],
      [0, 1 / 2, 1],
    ])
  })
})
