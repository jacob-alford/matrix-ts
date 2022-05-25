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
export type Mat55 = M.MatC<5, 5, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat55> = M.getAdditiveAbelianGroup(
  C.Field
)(5, 5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Mat55> = M.getBimodule(C.Field)(5, 5)
