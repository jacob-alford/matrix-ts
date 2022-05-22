import * as C from '../Complex'
import * as V from '../VecC'
import * as AbGrp from '../AbelianGroup'
import * as Mod from '../Module'
import * as VecSpc from '../VectorSpace'
import * as InPrSp from '../InnerProductSpace'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec2 = V.VecC<2, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec2> = V.getAbGroup(C.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Module: Mod.Module<C.Complex, Vec2> = V.getModule(C.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<C.Complex, Vec2> = V.getVectorSpace(C.Field)(
  2
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<C.Complex, Vec2> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(2)
