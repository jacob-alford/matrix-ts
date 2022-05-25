import * as M from '../MatrixC'
import * as C from '../Complex'
import * as AbGrp from '../AbelianGroup'
import * as Mod from '../Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat44 = M.MatC<4, 4, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat44> = M.getAdditiveAbelianGroup(
  C.Field
)(4, 4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Mat44> = M.getBimodule(C.Field)(4, 4)
