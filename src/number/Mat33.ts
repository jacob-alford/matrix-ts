import * as N from 'fp-ts/number'

import * as M from '../MatrixC'
import * as AbGrp from '../AbelianGroup'
import * as Mod from '../Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat33 = M.MatC<3, 3, number>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat33> = M.getAdditiveAbelianGroup(
  N.Field
)(3, 3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<number, Mat33> = M.getBimodule(N.Field)(3, 3)
