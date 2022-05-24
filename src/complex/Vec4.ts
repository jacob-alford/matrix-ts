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
export type Vec4 = V.VecC<4, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec4> = V.getAbGroup(C.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Module: Mod.Bimodule<C.Complex, Vec4> = V.getBimodule(C.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<C.Complex, Vec4> = V.getVectorSpace(C.Field)(
  4
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<C.Complex, Vec4> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(4)
