import * as N from 'fp-ts/number'

import * as V from '../VecC'
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
export type Vec2 = V.VecC<2, number>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec2> = V.getAbGroup(N.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Module: Mod.Module<number, Vec2> = V.getModule(N.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<number, Vec2> = V.getVectorField(N.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<number, Vec2> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(2)
