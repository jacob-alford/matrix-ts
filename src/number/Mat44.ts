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
export type Mat44 = M.MatC<4, 4, number>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat44> = M.getAdditiveAbelianGroup(
  N.Field
)(4, 4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<number, Mat44> = M.getBimodule(N.Field)(4, 4)
