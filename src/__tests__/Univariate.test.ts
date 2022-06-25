import * as Stat from '../Univariate'

describe('Multivariate', () => {
  it('calculates a covariance matrix', () => {
    const sample: Stat.Sample = [73, 73, 76, 77, 81, 100]

    const mean = Stat.mean(sample)

    expect(mean).toBe(80)
  })
})
