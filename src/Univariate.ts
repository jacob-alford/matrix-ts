import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as RTup from 'fp-ts/ReadonlyTuple'
import { flow, identity, pipe, tuple } from 'fp-ts/function'

import * as N from './number'

// #############
// ### Model ###
// #############

/**
 * An observation is a (free) collection of samples
 *
 * @since 1.0.0
 * @category Model
 */
export type Sample = RNEA.ReadonlyNonEmptyArray<number>

/**
 * An observation is a (free) collection of samples
 *
 * @since 1.0.0
 * @category Model
 */
export type BivariateSample = RNEA.ReadonlyNonEmptyArray<readonly [number, number]>

// ###############################
// ### Multivariate Statistics ###
// ###############################

/**
 * The average value over different variables
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const mean: (s: Sample) => number = s =>
  pipe(s, RNEA.foldMap(N.MonoidSum)(identity), a => a / s.length)

/**
 * The difference in observation from a mean of Sample
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const deviation: (s: Sample) => Sample = s => {
  const mu = mean(s)
  return pipe(
    s,
    RNEA.map(a => a - mu)
  )
}

/**
 * The covariance of a bivariate sample, is the mutual variance between the two random variables
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const covariance: (ab: BivariateSample) => number = ab => {
  const da = pipe(ab, RNEA.map(RTup.fst), deviation)
  const db = pipe(ab, RNEA.map(RTup.snd), deviation)
  return pipe(
    RNEA.zipWith(da, db, (a, b) => a * b),
    RNEA.foldMap(N.MonoidSum)(identity),
    ss => ss / ab.length
  )
}

/**
 * The covariance of a bivariate sample, is the mutual variance between the two random variables
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const variance: (ab: Sample) => number = flow(
  RNEA.map(a => tuple(a, a)),
  covariance
)

/**
 * The correlation matrix where each index: i, j represent the correlation between those
 * two random variables
 *
 * @since 1.0.0
 * @category Multivariate Statistics
 */
export const correlation: (ab: BivariateSample) => number = ab => {
  const a = pipe(ab, RNEA.map(RTup.fst))
  const b = pipe(ab, RNEA.map(RTup.snd))
  const cov = covariance(ab)
  const sa = Math.sqrt(variance(a))
  const sb = Math.sqrt(variance(b))
  return cov / (sa * sb)
}
