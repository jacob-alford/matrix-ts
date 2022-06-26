/**
 * An integral data type without a decimal. Partially borrowed from Purescript.
 *
 * @since 1.0.0
 */
import * as Bnd from 'fp-ts/Bounded'
import * as Eq_ from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as Mg from 'fp-ts/Magma'
import * as Mn from 'fp-ts/Monoid'
import * as Sg from 'fp-ts/Semigroup'
import * as N from 'fp-ts/number'
import * as Ord_ from 'fp-ts/Ord'
import * as Sh from 'fp-ts/Show'
import { flow, identity, unsafeCoerce } from 'fp-ts/function'

import * as Inf from './infix'
import * as Iso from './Iso'
import * as TC from './typeclasses'
import * as V from './Vector'
import * as M from './Matrix'
import * as Poly from './Polynomial'

const IntegerSymbol = Symbol('Integer')
type IntegerSymbol = typeof IntegerSymbol

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Int = number & {
  readonly _URI: IntegerSymbol
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromNumber: (n: number) => Int = n => unsafeCoerce(n | 0)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero: Int = fromNumber(0)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const one: Int = fromNumber(1)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const randInt: (min: number, max: number) => IO.IO<Int> = (low, high) => () =>
  fromNumber(Math.floor((high - low + 1) * Math.random() + low))

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const Eq: Eq_.Eq<Int> = N.Eq

/**
 * @since 1.0.0
 * @category Instances
 */
export const Ord: Ord_.Ord<Int> = N.Ord

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bounded: Bnd.Bounded<Int> = {
  ...Ord,
  top: fromNumber(Infinity),
  bottom: fromNumber(-Infinity),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MagmaSub: Mg.Magma<Int> = {
  concat: (x, y) => fromNumber(x - y),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupSum: Sg.Semigroup<Int> = {
  concat: (x, y) => fromNumber(x + y),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupProduct: Sg.Semigroup<Int> = {
  concat: (x, y) => fromNumber(x * y),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidSum: Mn.Monoid<Int> = {
  ...SemigroupSum,
  empty: zero,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidProduct: Mn.Monoid<Int> = {
  ...SemigroupProduct,
  empty: one,
}

/**
 * Adapted from Purescript:
 * https://github.com/purescript/purescript-prelude/blob/v6.0.0/src/Data/EuclideanRing.js
 *
 * @since 1.0.0
 * @category Instances
 */
export const EuclideanRing: TC.EuclidianRing<Int> = {
  add: MonoidSum.concat,
  zero,
  sub: MagmaSub.concat,
  mul: MonoidProduct.concat,
  one,
  div: (x, y) =>
    y === 0 ? zero : y > 0 ? fromNumber(x / y) : fromNumber(-Math.floor(x / -y)),
  mod: (x, y) => (y === 0 ? zero : (yy => fromNumber(((x % yy) + yy) % yy))(Math.abs(y))),
  degree: x => Math.min(Math.abs(x), 2147483647),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Show: Sh.Show<Int> = N.Show

// #############
// ### Infix ###
// #############

/**
 * @since 1.0.0
 * @category Infix
 */
export const _ = Inf.getEuclideanRingInfix(EuclideanRing)

/**
 * @since 1.0.0
 * @category Infix
 */
export const $_ = Inf.getEuclideanRingPolishInfix(EuclideanRing)

/**
 * @since 1.0.0
 * @category Infix
 */
export const _$ = Inf.getEuclideanRingReversePolishInfix(EuclideanRing)

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toNumber: (x: Int) => number = identity

// ####################
// ### Isomorphisms ###
// ####################

/**
 * @since 1.0.0
 * @category Isomorphisms
 */
export const isoNumber: Iso.Iso<Int, number> = {
  get: toNumber,
  reverseGet: fromNumber,
}

// ###################
// ### Integer Ops ###
// ###################

/**
 * @since 1.0.0
 * @category Integer Ops
 */
export const abs: (a: Int) => Int = flow(Math.abs, fromNumber)

// #############
// ### VecN ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec<N> = V.Vec<N, Int>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbGrpN = V.getAdditiveAbelianGroup(EuclideanRing)

/**
 * @since 1.0.0
 * @category Instances
 */
export const BiModN = V.getBimodule(EuclideanRing)

// ###############
// ### Mat MxN ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat<M, N> = M.Mat<M, N, Int>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbGrpMN = M.getAdditiveAbelianGroup(EuclideanRing)

/**
 * @since 1.0.0
 * @category Instances
 */
export const BiModMN = M.getBimodule(EuclideanRing)

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialAdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(
  Eq,
  EuclideanRing
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialBimodule = Poly.getBimodule(Eq, EuclideanRing)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialRing = Poly.getCommutativeRing(Eq, EuclideanRing)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialEuclidianRing = Poly.getEuclidianRing(Eq, EuclideanRing)

// ###############
// ### Aliases ###
// ###############

/**
 * @since 1.0.0
 * @category Aliases
 */
export const add = EuclideanRing.add

/**
 * @since 1.0.0
 * @category Aliases
 */
export const sub = EuclideanRing.sub

/**
 * @since 1.0.0
 * @category Aliases
 */
export const mul = EuclideanRing.mul

/**
 * @since 1.0.0
 * @category Aliases
 */
export const div = EuclideanRing.div

/**
 * @since 1.0.0
 * @category Aliases
 */
export const mod = EuclideanRing.mod

/**
 * @since 1.0.0
 * @category Aliases
 */
export const degree = EuclideanRing.degree
