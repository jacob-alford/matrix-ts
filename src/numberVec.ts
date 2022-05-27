import * as N from 'fp-ts/number'
import * as Z from 'fp-ts/Zero'

import * as V from './VectorC'
import * as AbGrp from './Commutative'
import * as Mod from './Module'
import * as VecSpc from './VectorSpace'
import * as Conj from './Conjugate'
import * as InPrSp from './InnerProductSpace'

// #############
// ### Vec1 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec1 = V.VecC<1, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup1: AbGrp.AbelianGroup<Vec1> = V.getAbGroup(N.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule1: Mod.Bimodule<number, Vec1> = V.getBimodule(N.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField1: VecSpc.VectorSpace<number, Vec1> = V.getVectorSpace(N.Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace1: InPrSp.InnerProductSpace<number, Vec1> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(1)

// #############
// ### Vec2 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec2 = V.VecC<2, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup2: AbGrp.AbelianGroup<Vec2> = V.getAbGroup(N.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule2: Mod.Bimodule<number, Vec2> = V.getBimodule(N.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField2: VecSpc.VectorSpace<number, Vec2> = V.getVectorSpace(N.Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace2: InPrSp.InnerProductSpace<number, Vec2> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(2)

// #############
// ### Vec3 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec3 = V.VecC<3, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup3: AbGrp.AbelianGroup<Vec3> = V.getAbGroup(N.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule3: Mod.Bimodule<number, Vec3> = V.getBimodule(N.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField3: VecSpc.VectorSpace<number, Vec3> = V.getVectorSpace(N.Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace3: InPrSp.InnerProductSpace<number, Vec3> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(3)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const crossProduct = V.crossProduct(N.Field)

// #############
// ### Vec4 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec4 = V.VecC<4, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup4: AbGrp.AbelianGroup<Vec4> = V.getAbGroup(N.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule4: Mod.Bimodule<number, Vec4> = V.getBimodule(N.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField4: VecSpc.VectorSpace<number, Vec4> = V.getVectorSpace(N.Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace4: InPrSp.InnerProductSpace<number, Vec4> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(4)

// #############
// ### Vec5 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec5 = V.VecC<5, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup5: AbGrp.AbelianGroup<Vec5> = V.getAbGroup(N.Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule5: Mod.Bimodule<number, Vec5> = V.getBimodule(N.Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField5: VecSpc.VectorSpace<number, Vec5> = V.getVectorSpace(N.Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace5: InPrSp.InnerProductSpace<number, Vec5> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(5)

// #############
// ### Vec6 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec6 = V.VecC<6, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup6: AbGrp.AbelianGroup<Vec6> = V.getAbGroup(N.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule6: Mod.Bimodule<number, Vec6> = V.getBimodule(N.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField6: VecSpc.VectorSpace<number, Vec6> = V.getVectorSpace(N.Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace6: InPrSp.InnerProductSpace<number, Vec6> =
  V.getInnerProductSpace(N.Field, Conj.ConjugateNumber)(6)
