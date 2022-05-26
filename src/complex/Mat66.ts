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
export type Mat66 = M.MatC<6, 6, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: AbGrp.AbelianGroup<Mat66> = M.getAdditiveAbelianGroup(
  C.Field
)(6, 6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Mat66> = M.getBimodule(C.Field)(6, 6)

// ##############
// ### Common ###
// ##############

/**
 * @since 1.0.0
 * @category Common
 */
export const id = M.id(C.Field)(6)
