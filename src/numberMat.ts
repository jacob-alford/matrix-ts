import * as N from 'fp-ts/number'

import * as M from './MatrixC'
import * as AbGrp from './Commutative'
import * as Mod from './Module'

// ###############
// ### Mat 2x2 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat22 = M.MatC<2, 2, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup22: AbGrp.AbelianGroup<Mat22> =
  M.getAdditiveAbelianGroup(N.Field)(2, 2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule22: Mod.Bimodule<number, Mat22> = M.getBimodule(N.Field)(2, 2)

// ###############
// ### Mat 3x3 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat33 = M.MatC<3, 3, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup33: AbGrp.AbelianGroup<Mat33> =
  M.getAdditiveAbelianGroup(N.Field)(3, 3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule33: Mod.Bimodule<number, Mat33> = M.getBimodule(N.Field)(3, 3)

// ###############
// ### Mat 4x4 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat44 = M.MatC<4, 4, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup44: AbGrp.AbelianGroup<Mat44> =
  M.getAdditiveAbelianGroup(N.Field)(4, 4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule44: Mod.Bimodule<number, Mat44> = M.getBimodule(N.Field)(4, 4)

// ###############
// ### Mat 5x5 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat55 = M.MatC<5, 5, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup55: AbGrp.AbelianGroup<Mat55> =
  M.getAdditiveAbelianGroup(N.Field)(5, 5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule55: Mod.Bimodule<number, Mat55> = M.getBimodule(N.Field)(5, 5)

// ###############
// ### Mat 6x6 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat66 = M.MatC<6, 6, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup66: AbGrp.AbelianGroup<Mat66> =
  M.getAdditiveAbelianGroup(N.Field)(6, 6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule66: Mod.Bimodule<number, Mat66> = M.getBimodule(N.Field)(6, 6)
