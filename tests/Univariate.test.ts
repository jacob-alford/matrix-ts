import * as Stat from '../src/Univariate'

describe('Univariate', () => {
  it('calculates a mean', () => {
    const sample: Stat.Sample = [73, 73, 76, 77, 81, 100]

    const mean = Stat.mean(sample)

    expect(mean).toBe(80)
  })
})
