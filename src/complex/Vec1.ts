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
export type Vec1 = V.VecC<1, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec1> = V.getAbGroup(C.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Module: Mod.Module<C.Complex, Vec1> = V.getModule(C.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<C.Complex, Vec1> = V.getVectorSpace(C.Field)(
  1
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<C.Complex, Vec1> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(1)
