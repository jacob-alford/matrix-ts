import * as C from '../Complex'
import * as V from '../VectorC'
import * as AbGrp from '../Commutative'
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
export type Vec3 = V.VecC<3, C.Complex>

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup: AbGrp.AbelianGroup<Vec3> = V.getAbGroup(C.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: Mod.Bimodule<C.Complex, Vec3> = V.getBimodule(C.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField: VecSpc.VectorSpace<C.Complex, Vec3> = V.getVectorSpace(C.Field)(
  3
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace: InPrSp.InnerProductSpace<C.Complex, Vec3> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(3)
