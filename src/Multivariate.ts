import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { identity, pipe } from 'fp-ts/function'

import * as V from './Vector'
import * as M from './Matrix'
import * as MatTypes from './MatrixTypes'
import * as N from './number'

// #############
// ### Model ###
// #############

/**
 * An observation is a (free) collection of data vectors, where N is the number of
 * variables associated with the observation
 *
 * @since 1.0.0
 * @category Model
 * @example
 *   Given three subjects whose measurements are height, weight, shoe size, we can construct a correlation matrix as follows:
 *
 *   ```ts
 *   import * as V from 'matrix-ts/vector'
 *   import * as MStat from 'matrix-ts/Multivariate'
 *
 *   const obs1 = V.fromTuple([167, 63, 8])
 *   const obs2 = V.fromTuple([200, 94, 12])
 *   const obs3 = V.fromTuple([160, 65, 9])
 *   const observations = RNEA.concat(RNEA.of(obs3))([obs1, obs2])
 *
 *   // This determines how mutually correlated the different variables are
 *   const corr = MStat.correlation(observations)
 *   ```
 */
export type MultivariateSample<N> = RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>

// ###############################
// ### Multivariate Statistics ###
// ###############################

/**
 * The average value over different variables
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const mean: <N extends number>(
  s: MultivariateSample<N>
) => V.Vec<N, number> = s => {
  const n = V.size(RNEA.head(s))
  const AbGrp = N.AdditiveAbGrpN(n)
  return pipe(
    s,
    RNEA.foldMap(AbGrp)(identity),
    V.map(n => n / s.length)
  )
}

/**
 * The difference in observation from a mean of MultivariateSample
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const deviation: <N extends number>(
  s: MultivariateSample<N>
) => MultivariateSample<N> = s => {
  const n = V.size(RNEA.head(s))
  const mu = mean(s)
  const AbGrp = N.AdditiveAbGrpN(n)
  const sub: (
    y: V.Vec<typeof n, number>
  ) => (x: V.Vec<typeof n, number>) => V.Vec<typeof n, number> = y => x =>
    AbGrp.concat(x, AbGrp.inverse(y))
  return pipe(s, RNEA.map(sub(mu)))
}

/**
 * The covariance matrix where each index: i, j represent the variance between each random
 * variable of the Multivariatesample
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const covariance: <N extends number>(
  s: MultivariateSample<N>
) => M.Mat<N, N, number> = s => {
  const n = V.size(RNEA.head(s))
  const AbGrpNN = N.AdditiveAbGrpMN(n, n)
  const BiModNN = N.BiModMN(n, n)
  const outerProduct = M.outerProduct(N.Field)
  return pipe(
    s,
    deviation,
    RNEA.foldMap(AbGrpNN)(d => outerProduct(d, d)),
    cov => BiModNN.leftScalarMul(1 / (s.length - 1), cov)
  )
}

/**
 * The correlation matrix where each index: i, j represent the correlation between those
 * two random variables
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const correlation: <N extends number>(
  s: MultivariateSample<N>
) => M.Mat<N, N, number> = s => {
  const mul = M.mul(N.Field)
  const inv = MatTypes.diagonalInverse(N.Field)
  const cov = covariance(s)
  const diagCov = MatTypes.extractDiagonal(0)(cov)
  const invSqrtCov = pipe(inv(diagCov), MatTypes.diagonalMap(Math.sqrt))
  return mul(mul(invSqrtCov, cov), invSqrtCov)
}
