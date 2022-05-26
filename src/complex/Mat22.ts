import * as M from '../MatrixC'
import * as C from '../Complex'
import * as AbGrp from '../Commutative'
import * as Mod from '../Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat22 = M.MatC<2, 2, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat22> = M.getAdditiveAbelianGroup(
  C.Field
)(2, 2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Mat22> = M.getBimodule(C.Field)(2, 2)
