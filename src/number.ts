import * as N from 'fp-ts/number'
import { identity } from 'fp-ts/function'

import * as Inf from './infix'
import * as Iso from './Iso'
import * as IO from 'fp-ts/IO'
import * as LI from './LinearIsomorphism'
import * as LM from './LinearMap'
import * as M from './Matrix'
import * as Poly from './Polynomial'
import * as V from './Vector'

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
  M: M.Mat<M, M, number>
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
 * @category Model
 */
export type Vec<N> = V.Vec<N, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbGrpN = V.getAbGroup(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const BiModN = V.getBimodule(Field)

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
export const dot = V.innerProduct(Field)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const norm = V.norm(Field)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const cross = V.crossProduct(Field)

// ###############
// ### Mat MxN ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat<M, N> = M.Mat<M, N, number>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbGrpMN = M.getAdditiveAbelianGroup(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const BiModMN = M.getBimodule(Field)

// #############################
// ### Polynomial Operations ###
// #############################

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

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const evaluatePolynomial = Poly.evaluate(Field)

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
export const polynomialInnerProduct = Poly.l2InnerProduct(Eq, Field, Field.mul, identity)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialNorm = Poly.norm(Eq, Field, Field.mul, Math.sqrt, identity)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialProjection = Poly.projection(Eq, Field, Field.mul, identity)
