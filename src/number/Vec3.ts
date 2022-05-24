import * as N from 'fp-ts/number'

import * as V from '../VectorC'
import * as AbGrp from '../AbelianGroup'
import * as Mod from '../Module'
import * as VecSpc from '../VectorSpace'
import * as Conj from '../Conjugate'
import * as InPrSp from '../InnerProductSpace'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec3 = V.VecC<3, number>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec3> = V.getAbGroup(N.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<number, Vec3> = V.getBimodule(N.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<number, Vec3> = V.getVectorSpace(N.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<number, Vec3> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(3)
