import * as N from 'fp-ts/number'
import { identity } from 'fp-ts/function'

import * as V from './VectorC'
import * as M from './MatrixC'
import * as C from './Complex'
import * as Exp_ from './Exponentiate'
import * as AbGrp from './Commutative'
import * as Mod from './Module'
import * as VecSpc from './VectorSpace'
import * as Conj from './Conjugate'
import * as Poly from './Polynomial'
import * as InPrSp from './InnerProductSpace'
import * as LinMap from './LinearMap'
import * as Abs_ from './Abs'

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const Exp: Exp_.Exp<number> = {
  exp: (a, n) => Math.pow(a, n),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Conjugate: Conj.Conjugate<number> = {
  conj: identity,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Abs: Abs_.Abs<number> = {
  abs: Math.abs,
}

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
  V.getInnerProductSpace(N.Field, Conjugate)(1)

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
  V.getInnerProductSpace(N.Field, Conjugate)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLinearMap2: (M: Mat22) => LinMap.LinearMap<Vec2, Vec2> =
  M.getLinearMap(InnerProductSpace2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRotationMap2: (theta: number) => LinMap.LinearMap<Vec2, Vec2> = theta =>
  getLinearMap2(
    M.fromNestedTuples([
      [Math.cos(theta), -Math.sin(theta)],
      [Math.sin(theta), Math.cos(theta)],
    ])
  )

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

/**
 * @since 1.0.0
 * @category Constructors
 */
export const matFromComplex: (c: C.Complex) => Mat22 = ({ Re, Im }) =>
  M.fromNestedTuples([
    [Re, -Im],
    [Im, Re],
  ])

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
  V.getInnerProductSpace(N.Field, Conjugate)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLinearMap3: (M: Mat33) => LinMap.LinearMap<Vec3, Vec3> =
  M.getLinearMap(InnerProductSpace3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getXRotationMap3: (theta: number) => LinMap.LinearMap<Vec3, Vec3> = theta =>
  getLinearMap3(
    M.fromNestedTuples([
      [1, 0, 0],
      [0, Math.cos(theta), -Math.sin(theta)],
      [0, Math.sin(theta), Math.cos(theta)],
    ])
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getYRotationMap3: (theta: number) => LinMap.LinearMap<Vec3, Vec3> = theta =>
  getLinearMap3(
    M.fromNestedTuples([
      [Math.cos(theta), 0, Math.sin(theta)],
      [0, 1, 0],
      [-Math.sin(theta), 0, Math.cos(theta)],
    ])
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getZRotationMap3: (theta: number) => LinMap.LinearMap<Vec3, Vec3> = theta =>
  getLinearMap3(
    M.fromNestedTuples([
      [Math.cos(theta), -Math.sin(theta), 0],
      [Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1],
    ])
  )

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const cross = V.crossProduct(N.Field)

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
  V.getInnerProductSpace(N.Field, Conjugate)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLinearMap4: (M: Mat44) => LinMap.LinearMap<Vec4, Vec4> =
  M.getLinearMap(InnerProductSpace4)

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
  V.getInnerProductSpace(N.Field, Conjugate)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLinearMap5: (M: Mat55) => LinMap.LinearMap<Vec5, Vec5> =
  M.getLinearMap(InnerProductSpace5)

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
  V.getInnerProductSpace(N.Field, Conjugate)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLinearMap6: (M: Mat66) => LinMap.LinearMap<Vec6, Vec6> =
  M.getLinearMap(InnerProductSpace6)

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

// ############################
// ### Polynomial Instances ###
// ############################

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialAdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(N.Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialBimodule = Poly.getBimodule(N.Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialRing = Poly.getRing(N.Field)

// ##############################
// ### Polynomial Destructors ###
// ##############################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const evaluatePolynomial = Poly.evaluate(N.Field, Exp)

/**
 * @since 1.0.0
 * @category Destructors
 */
export const polynomialToExpression = Poly.toExpression<`${number}z^${number}`, number>(
  N.Field,
  Exp,
  ([coefficient, power]) => `${coefficient}z^${power}`
)
