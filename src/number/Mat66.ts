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
export type Mat6 = M.MatC<6, 6, number>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat6> = M.getAdditiveAbelianGroup(
  N.Field
)(6, 6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<number, Mat6> = M.getBimodule(N.Field)(6, 6)
