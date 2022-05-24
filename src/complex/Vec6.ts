import * as C from '../Complex'
import * as V from '../VectorC'
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
export type Vec6 = V.VecC<6, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec6> = V.getAbGroup(C.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Vec6> = V.getBimodule(C.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<C.Complex, Vec6> = V.getVectorSpace(C.Field)(
  6
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<C.Complex, Vec6> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(6)
