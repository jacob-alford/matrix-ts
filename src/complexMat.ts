import * as M from './MatrixC'
import * as Comm from './Commutative'
import * as Mod from './Module'
import * as C from './Complex'

// ###############
// ### Mat 2x2 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat22 = M.MatC<2, 2, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup22: Comm.AbelianGroup<Mat22> = M.getAdditiveAbelianGroup(
  C.Field
)(2, 2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule22: Mod.Bimodule<C.Complex, Mat22> = M.getBimodule(C.Field)(2, 2)

// ###############
// ### Mat 3x3 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat33 = M.MatC<3, 3, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup33: Comm.AbelianGroup<Mat33> = M.getAdditiveAbelianGroup(
  C.Field
)(3, 3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule33: Mod.Bimodule<C.Complex, Mat33> = M.getBimodule(C.Field)(3, 3)

// ###############
// ### Mat 4x4 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat44 = M.MatC<4, 4, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup44: Comm.AbelianGroup<Mat44> = M.getAdditiveAbelianGroup(
  C.Field
)(4, 4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule44: Mod.Bimodule<C.Complex, Mat44> = M.getBimodule(C.Field)(4, 4)

// ###############
// ### Mat 5x5 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat55 = M.MatC<5, 5, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup55: Comm.AbelianGroup<Mat55> = M.getAdditiveAbelianGroup(
  C.Field
)(5, 5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule55: Mod.Bimodule<C.Complex, Mat55> = M.getBimodule(C.Field)(5, 5)

// ###############
// ### Mat 6x6 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat66 = M.MatC<6, 6, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup66: Comm.AbelianGroup<Mat66> = M.getAdditiveAbelianGroup(
  C.Field
)(6, 6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule66: Mod.Bimodule<C.Complex, Mat66> = M.getBimodule(C.Field)(6, 6)
