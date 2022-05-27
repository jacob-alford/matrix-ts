import * as N from 'fp-ts/number'

import * as Exp from './Exponentiate'
import * as Poly from './Polynomial'

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(N.Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule = Poly.getBimodule(N.Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Ring = Poly.getRing(N.Field)

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const evaluate = Poly.evaluate(N.Field, Exp.ExpNumber)

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toExpression = Poly.toExpression<`${number}z^${number}`, number>(
  N.Field,
  Exp.ExpNumber,
  ([coefficient, power]) => `${coefficient}z^${power}`
)
