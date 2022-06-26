import * as N from 'fp-ts/number'
import { identity } from 'fp-ts/function'

import * as Auto from './Automorphism'
import * as Inf from './infix'
import * as IO from 'fp-ts/IO'
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
export const AdditiveAbGrpN = V.getAdditiveAbelianGroup(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const BiModN = V.getBimodule(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const get2dRotation: (
  theta: number
) => Auto.Automorphism<V.Vec<2, number>> = theta => {
  const to = M.fromNestedTuples([
    [Math.cos(theta), -Math.sin(theta)],
    [Math.sin(theta), Math.cos(theta)],
  ])
  const from = M.fromNestedTuples([
    [Math.cos(theta), Math.sin(theta)],
    [-Math.sin(theta), Math.cos(theta)],
  ])
  return {
    get: x => linMap(to, x),
    reverseGet: x => linMap(from, x),
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const get3dXRotation: (
  theta: number
) => Auto.Automorphism<V.Vec<3, number>> = theta => {
  const to = M.fromNestedTuples([
    [1, 0, 0],
    [0, Math.cos(theta), -Math.sin(theta)],
    [0, Math.sin(theta), Math.cos(theta)],
  ])
  const from = M.fromNestedTuples([
    [1, 0, 0],
    [0, Math.cos(theta), Math.sin(theta)],
    [0, -Math.sin(theta), Math.cos(theta)],
  ])
  return {
    get: x => linMap(to, x),
    reverseGet: x => linMap(from, x),
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const get3dYRotation: (
  theta: number
) => Auto.Automorphism<V.Vec<3, number>> = theta => {
  const to = M.fromNestedTuples([
    [Math.cos(theta), 0, Math.sin(theta)],
    [0, 1, 0],
    [-Math.sin(theta), 0, Math.cos(theta)],
  ])
  const from = M.fromNestedTuples([
    [Math.cos(theta), 0, -Math.sin(theta)],
    [0, 1, 0],
    [Math.sin(theta), 0, Math.cos(theta)],
  ])
  return {
    get: x => linMap(to, x),
    reverseGet: x => linMap(from, x),
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const get3dZRotation: (
  theta: number
) => Auto.Automorphism<V.Vec<3, number>> = theta => {
  const to = M.fromNestedTuples([
    [Math.cos(theta), -Math.sin(theta), 0],
    [Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 1],
  ])
  const from = M.fromNestedTuples([
    [Math.cos(theta), Math.sin(theta), 0],
    [-Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 1],
  ])
  return {
    get: x => linMap(to, x),
    reverseGet: x => linMap(from, x),
  }
}

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const dot = V.innerProduct(Field, identity)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const cross = V.crossProduct(Field)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const outerProduct = M.outerProduct(Field)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const l1Norm = V.l1Norm(Field)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const l2Norm = V.l2Norm(Field, Math.abs, Math.pow)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const lpNorm: (p: number) => <N>(v: V.Vec<N, number>) => number = p =>
  V.lpNorm(p)(Field, Math.abs, Math.pow)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const lInfNorm = V.lInfNorm(Bounded, Math.abs)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const projection = V.projection(Field, identity)

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

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const idMat = M.identity(Field)

/**
 * Compose two matricies: `A`, and `B` with Matrix multiplication.
 *
 * For A in `MxN`, and B in `NxP` returns `AB` in `MxP`.
 *
 * @since 1.0.0
 * @category Matrix Operations
 */
export const mulM = M.mul(Field)

/**
 * Map a vector with length `N`, with a matrix A with size `MxN`, to a vector of length `M`.
 *
 * @since 1.0.0
 * @category Matrix Operations
 */
export const linMap = M.linMap(Field)

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const trace = M.trace(Field)

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
export const getDifferentialAutomorphism: (
  constantTerm: number
) => Auto.Automorphism<Poly.Polynomial<number>> = constantTerm => ({
  get: derivative,
  reverseGet: getAntiderivative(constantTerm),
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
export const integrate = Poly.integrate(Field, Field.mul)

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

// ###############
// ### Aliases ###
// ###############

/**
 * @since 1.0.0
 * @category Aliases
 */
export const add = Field.add

/**
 * @since 1.0.0
 * @category Aliases
 */
export const sub = Field.sub

/**
 * @since 1.0.0
 * @category Aliases
 */
export const mul = Field.mul

/**
 * @since 1.0.0
 * @category Aliases
 */
export const div = Field.div

/**
 * @since 1.0.0
 * @category Aliases
 */
export const mod = Field.mod

/**
 * @since 1.0.0
 * @category Aliases
 */
export const degree = Field.degree
