import * as N from 'fp-ts/number'

import * as C from './complex'
import * as Inf from './infix'
import * as Iso from './Iso'
import * as IO from 'fp-ts/IO'
import * as LI from './LinearIsomorphism'
import * as LM from './LinearMap'
import * as M from './MatrixC'
import * as Poly from './Polynomial'
import * as TC from './typeclasses'
import * as V from './VectorC'

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero = 0

/**
 * @since 1.0.0
 * @category Constructors
 */
export const one = 1

/**
 * @since 1.0.0
 * @category Constructors
 */
export const randNumber: (low: number, high: number) => IO.IO<number> =
  (low, high) => () =>
    (high - low + 1) * Math.random() + low

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const Eq = N.Eq

/**
 * @since 1.0.0
 * @category Instances
 */
export const Ord = N.Ord

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bounded = N.Bounded

/**
 * @since 1.0.0
 * @category Instances
 */
export const MagmaSub = N.MagmaSub

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupSum = N.SemigroupSum

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupProduct = N.SemigroupProduct

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidSum = N.MonoidSum

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidProduct = N.MonoidProduct

/**
 * @since 1.0.0
 * @category Instances
 */
export const Field = N.Field

/**
 * @since 1.0.0
 * @category Instances
 */
export const Show = N.Show

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLinearMap: <M>(
  M: M.MatC<M, M, number>
) => LM.LinearMap2<V.URI, M, number, number> = M.getLinearMap(Field)

// #############
// ### Infix ###
// #############

/**
 * @since 1.0.0
 * @category Infix
 */
export const _ = Inf.getFieldInfix(Field)

/**
 * @since 1.0.0
 * @category Infix
 */
export const $_ = Inf.getFieldPolishInfix(Field)

/**
 * @since 1.0.0
 * @category Infix
 */
export const _$ = Inf.getFieldReversePolishInfix(Field)

// #############
// ### VecN ####
// #############

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const dot = V.innerProduct(Field)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const norm = V.norm(Field)

// ##############
// ### Vec1d ####
// ##############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec1d = V.VecC<1, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup1d: TC.AbelianGroup<Vec1d> = V.getAbGroup(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule1d: TC.Bimodule<Vec1d, number> = V.getBimodule(Field)(1)

// ##############
// ### Vec2d ####
// ##############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec2d = V.VecC<2, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup2d: TC.AbelianGroup<Vec2d> = V.getAbGroup(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule2d: TC.Bimodule<Vec2d, number> = V.getBimodule(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRotationMap2d: (
  theta: number
) => LI.LinearIsomorphism2<V.URI, 2, number, number> = theta => {
  const to = getLinearMap(
    M.fromNestedTuples([
      [Math.cos(theta), -Math.sin(theta)],
      [Math.sin(theta), Math.cos(theta)],
    ])
  )
  const from = getLinearMap(
    M.fromNestedTuples([
      [Math.cos(theta), Math.sin(theta)],
      [-Math.sin(theta), Math.cos(theta)],
    ])
  )
  return {
    ...to,
    reverseMapL: from.mapL,
  }
}
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
export const AdditiveAbelianGroup22: TC.AbelianGroup<Mat22> = M.getAdditiveAbelianGroup(
  Field
)(2, 2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule22: TC.Bimodule<Mat22, number> = M.getBimodule(Field)(2, 2)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const matFromComplex: (c: C.Complex) => Mat22 = ({ Re, Im }) =>
  M.fromNestedTuples([
    [Re, -Im],
    [Im, Re],
  ])

// ##############
// ### Vec3d ####
// ##############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec3d = V.VecC<3, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup3d: TC.AbelianGroup<Vec3d> = V.getAbGroup(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule3d: TC.Bimodule<Vec3d, number> = V.getBimodule(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getXRotationMap3d: (
  theta: number
) => LI.LinearIsomorphism2<V.URI, 3, number, number> = theta => {
  const to = getLinearMap(
    M.fromNestedTuples([
      [1, 0, 0],
      [0, Math.cos(theta), -Math.sin(theta)],
      [0, Math.sin(theta), Math.cos(theta)],
    ])
  )
  const from = getLinearMap(
    M.fromNestedTuples([
      [1, 0, 0],
      [0, Math.cos(theta), Math.sin(theta)],
      [0, -Math.sin(theta), Math.cos(theta)],
    ])
  )
  return {
    ...to,
    reverseMapL: from.mapL,
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getYRotationMap3d: (
  theta: number
) => LI.LinearIsomorphism2<V.URI, 3, number, number> = theta => {
  const to = getLinearMap(
    M.fromNestedTuples([
      [Math.cos(theta), 0, Math.sin(theta)],
      [0, 1, 0],
      [-Math.sin(theta), 0, Math.cos(theta)],
    ])
  )
  const from = getLinearMap(
    M.fromNestedTuples([
      [Math.cos(theta), 0, -Math.sin(theta)],
      [0, 1, 0],
      [Math.sin(theta), 0, Math.cos(theta)],
    ])
  )
  return {
    ...to,
    reverseMapL: from.mapL,
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getZRotationMap3d: (
  theta: number
) => LI.LinearIsomorphism2<V.URI, 3, number, number> = theta => {
  const to = getLinearMap(
    M.fromNestedTuples([
      [Math.cos(theta), -Math.sin(theta), 0],
      [Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1],
    ])
  )
  const from = getLinearMap(
    M.fromNestedTuples([
      [Math.cos(theta), Math.sin(theta), 0],
      [-Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1],
    ])
  )
  return {
    ...to,
    reverseMapL: from.mapL,
  }
}

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const cross = V.crossProduct(Field)

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
export const AdditiveAbelianGroup33: TC.AbelianGroup<Mat33> = M.getAdditiveAbelianGroup(
  Field
)(3, 3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule33: TC.Bimodule<Mat33, number> = M.getBimodule(Field)(3, 3)

// ##############
// ### Vec4d ####
// ##############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec4d = V.VecC<4, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup4d: TC.AbelianGroup<Vec4d> = V.getAbGroup(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule4d: TC.Bimodule<Vec4d, number> = V.getBimodule(Field)(4)

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
export const AdditiveAbelianGroup44: TC.AbelianGroup<Mat44> = M.getAdditiveAbelianGroup(
  Field
)(4, 4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule44: TC.Bimodule<Mat44, number> = M.getBimodule(Field)(4, 4)

// ##############
// ### Vec5d ####
// ##############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec5d = V.VecC<5, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup5d: TC.AbelianGroup<Vec5d> = V.getAbGroup(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule5d: TC.Bimodule<Vec5d, number> = V.getBimodule(Field)(5)

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
export const AdditiveAbelianGroup55: TC.AbelianGroup<Mat55> = M.getAdditiveAbelianGroup(
  Field
)(5, 5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule55: TC.Bimodule<Mat55, number> = M.getBimodule(Field)(5, 5)

// ##############
// ### Vec6d ####
// ##############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec6d = V.VecC<6, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup6d: TC.AbelianGroup<Vec6d> = V.getAbGroup(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule6d: TC.Bimodule<Vec6d, number> = V.getBimodule(Field)(6)

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
export const AdditiveAbelianGroup66: TC.AbelianGroup<Mat66> = M.getAdditiveAbelianGroup(
  Field
)(6, 6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule66: TC.Bimodule<Mat66, number> = M.getBimodule(Field)(6, 6)

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const derivative = Poly.derivative(Field.mul)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const getAntiderivative: (
  constantTerm: number
) => (p: Poly.Polynomial<number>) => Poly.Polynomial<number> = (constantTerm: number) =>
  Poly.antiderivative(constantTerm, Field.mul)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialInnerProduct = Poly.innerProduct(Eq, Field, Field.mul)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialNorm = Poly.norm(Eq, Field, Field.mul, Math.sqrt)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialProjection = Poly.projection(Eq, Field, Field.mul)

// ############################
// ### Polynomial Instances ###
// ############################

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialAdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(Eq, Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialBimodule = Poly.getBimodule(Eq, Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialRing = Poly.getCommutativeRing(Eq, Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialEuclidianRing = Poly.getEuclidianRing(Eq, Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getDifferentialLinearIsomorphism: (
  constantTerm: number
) => LI.LinearIsomorphism1<Poly.URI, number, number> = constantTerm => ({
  isoV: Iso.getId(),
  mapL: derivative,
  reverseMapL: getAntiderivative(constantTerm),
})
