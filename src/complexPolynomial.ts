import * as Poly from './Polynomial'
import * as C from './Complex'

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(C.Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule = Poly.getBimodule(C.Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Ring = Poly.getRing(C.Field)

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const evaluate = Poly.evaluate(C.Field, C.Exp)

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toExpression = Poly.toExpression<`(${string})z^${number}`, C.Complex>(
  C.Field,
  C.Exp,
  ([coefficient, power]) => `(${C.Show.show(coefficient)})z^${power}`
)
