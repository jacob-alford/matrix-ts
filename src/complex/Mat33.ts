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
export type Mat33 = M.MatC<3, 3, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat33> = M.getAdditiveAbelianGroup(
  C.Field
)(3, 3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Mat33> = M.getBimodule(C.Field)(3, 3)
