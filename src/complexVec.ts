import * as V from './VectorC'
import * as Comm from './Commutative'
import * as Mod from './Module'
import * as VecSpc from './VectorSpace'
import * as InPrSp from './InnerProductSpace'
import * as C from './Complex'

// #############
// ### Vec1 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec1 = V.VecC<1, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup1: Comm.AbelianGroup<Vec1> = V.getAbGroup(C.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule1: Mod.Bimodule<C.Complex, Vec1> = V.getBimodule(C.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField1: VecSpc.VectorSpace<C.Complex, Vec1> = V.getVectorSpace(
  C.Field
)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace1: InPrSp.InnerProductSpace<C.Complex, Vec1> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(1)

// #############
// ### Vec2 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec2 = V.VecC<2, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup2: Comm.AbelianGroup<Vec2> = V.getAbGroup(C.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule2: Mod.Bimodule<C.Complex, Vec2> = V.getBimodule(C.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField2: VecSpc.VectorSpace<C.Complex, Vec2> = V.getVectorSpace(
  C.Field
)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace2: InPrSp.InnerProductSpace<C.Complex, Vec2> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(2)

// #############
// ### Vec3 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec3 = V.VecC<3, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup3: Comm.AbelianGroup<Vec3> = V.getAbGroup(C.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule3: Mod.Bimodule<C.Complex, Vec3> = V.getBimodule(C.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField3: VecSpc.VectorSpace<C.Complex, Vec3> = V.getVectorSpace(
  C.Field
)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace3: InPrSp.InnerProductSpace<C.Complex, Vec3> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(3)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const cross = V.crossProduct(C.Field)

// #############
// ### Vec4 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec4 = V.VecC<4, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup4: Comm.AbelianGroup<Vec4> = V.getAbGroup(C.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule4: Mod.Bimodule<C.Complex, Vec4> = V.getBimodule(C.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField4: VecSpc.VectorSpace<C.Complex, Vec4> = V.getVectorSpace(
  C.Field
)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace4: InPrSp.InnerProductSpace<C.Complex, Vec4> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(4)

// #############
// ### Vec5 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec5 = V.VecC<5, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup5: Comm.AbelianGroup<Vec5> = V.getAbGroup(C.Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule5: Mod.Bimodule<C.Complex, Vec5> = V.getBimodule(C.Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField5: VecSpc.VectorSpace<C.Complex, Vec5> = V.getVectorSpace(
  C.Field
)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace5: InPrSp.InnerProductSpace<C.Complex, Vec5> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(5)

// #############
// ### Vec6 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec6 = V.VecC<6, C.Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup6: Comm.AbelianGroup<Vec6> = V.getAbGroup(C.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule6: Mod.Bimodule<C.Complex, Vec6> = V.getBimodule(C.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField6: VecSpc.VectorSpace<C.Complex, Vec6> = V.getVectorSpace(
  C.Field
)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace6: InPrSp.InnerProductSpace<C.Complex, Vec6> =
  V.getInnerProductSpace(C.Field, C.Conjugate)(6)
