import * as N from 'fp-ts/number'

import * as M from '../MatrixC'
import * as AbGrp from '../Commutative'
import * as Mod from '../Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat22 = M.MatC<2, 2, number>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat22> = M.getAdditiveAbelianGroup(
  N.Field
)(2, 2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<number, Mat22> = M.getBimodule(N.Field)(2, 2)
